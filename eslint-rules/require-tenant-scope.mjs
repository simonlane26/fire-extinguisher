/**
 * ESLint rule: require-tenant-scope
 *
 * Every Prisma query on a tenant-owned model must include `tenantId` in the
 * where clause. This is the application's only guard against cross-tenant data
 * leaks — there is no database-level RLS.
 *
 * Child-record models (e.g. fireAlarmCallPoint) are exempt because their parent
 * ownership is asserted before querying (e.g. assertSystemOwner()). If you add
 * a new child model with that pattern, add it to EXEMPT_MODELS below and leave
 * a comment explaining how ownership is verified.
 */

const PRISMA_METHODS = [
  'findMany',
  'findFirst',
  'findFirstOrThrow',
  'update',
  'updateMany',
  'delete',
  'deleteMany',
  'upsert',
];

/**
 * Models that legitimately omit tenantId from their where clause.
 * Each entry should have a comment explaining why it's safe.
 */
const EXEMPT_MODELS = [
  // Platform tables — not tenant-scoped by design
  'tenant',

  // Auth tokens — scoped by userId, not tenantId
  'passwordResetToken',
  'emailVerificationToken',

  // Child records — parent ownership is asserted before querying
  // fire-alarm.service.ts: assertSystemOwner(tenantId, systemId) called first
  'fireAlarmCallPoint',
  'fireAlarmLogEntry',

  // emergency-lighting.service.ts: assertLuminaireOwner(tenantId, luminaireId) called first
  'emergencyLightTest',

  // Join table — queried by userId, user is already tenant-scoped
  'userSiteAccess',

  // Auth tokens — scoped by token value (a secret), not by tenantId
  'verificationToken',

  // Push endpoints — scoped by endpoint (browser-generated globally-unique URL) or userId
  'pushSubscription',

  // Child of quote — no tenantId column; quote ownership verified before modifying lines
  'quoteLine',
];

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Prisma queries on tenant-owned models must include tenantId in the where clause to prevent cross-tenant data leaks.',
    },
    messages: {
      missingTenantId:
        "prisma.{{model}}.{{method}}() where clause is missing 'tenantId'. " +
        'Add tenantId to scope the query to the current tenant. ' +
        'If ownership is asserted via a prior check, add this model to EXEMPT_MODELS in eslint-rules/require-tenant-scope.mjs with a comment.',
    },
    schema: [],
  },

  create(context) {
    /**
     * Unwrap TypeScript type assertions: (expr as Type) → expr
     */
    function unwrap(node) {
      if (!node) return node;
      if (node.type === 'TSAsExpression' || node.type === 'TSTypeAssertion') {
        return unwrap(node.expression);
      }
      return node;
    }

    /**
     * Return true if `node` looks like `this.prisma` or just `prisma`.
     */
    function isPrismaRoot(node) {
      const n = unwrap(node);
      if (!n) return false;
      if (n.type === 'Identifier' && n.name === 'prisma') return true;
      if (
        n.type === 'MemberExpression' &&
        n.property?.name === 'prisma' &&
        !n.computed
      ) {
        return true;
      }
      return false;
    }

    return {
      CallExpression(node) {
        // callee must be a MemberExpression: <something>.findMany(...)
        const callee = unwrap(node.callee);
        if (!callee || callee.type !== 'MemberExpression') return;

        const method = callee.property?.name;
        if (!method || !PRISMA_METHODS.includes(method)) return;

        // object must be a MemberExpression: this.prisma.<model>
        const modelAccess = unwrap(callee.object);
        if (!modelAccess || modelAccess.type !== 'MemberExpression') return;

        const modelName = modelAccess.property?.name;
        if (!modelName) return;

        // Skip exempt models
        if (EXEMPT_MODELS.includes(modelName)) return;

        // Confirm the root is a Prisma client instance
        if (!isPrismaRoot(modelAccess.object)) return;

        // Inspect the first argument
        const firstArg = node.arguments[0];
        if (!firstArg || firstArg.type !== 'ObjectExpression') return;

        // Find the `where` property
        const whereProp = firstArg.properties.find(
          (p) =>
            p.type === 'Property' &&
            !p.computed &&
            (p.key?.name === 'where' || p.key?.value === 'where'),
        );
        if (!whereProp) return; // No where clause — not this rule's concern

        // If where is a variable/spread we can't inspect statically — skip
        const whereValue = whereProp.value;
        if (!whereValue || whereValue.type !== 'ObjectExpression') return;

        // Check whether `tenantId` appears as a direct key in the where object
        const hasTenantId = whereValue.properties.some(
          (p) =>
            p.type === 'Property' &&
            !p.computed &&
            (p.key?.name === 'tenantId' || p.key?.value === 'tenantId'),
        );

        if (!hasTenantId) {
          context.report({
            node,
            messageId: 'missingTenantId',
            data: { model: modelName, method },
          });
        }
      },
    };
  },
};
