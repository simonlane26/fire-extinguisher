// Test S3 connection and upload
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// You'll need to paste your Railway S3 credentials here temporarily
const AWS_REGION = 'eu-west-2';
const S3_BUCKET = '26Fire-extinguisher-app26';
const AWS_ACCESS_KEY_ID = process.argv[2]; // Pass as argument
const AWS_SECRET_ACCESS_KEY = process.argv[3]; // Pass as argument

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  console.error('\n❌ Usage: node test-s3.js <access-key-id> <secret-access-key>\n');
  process.exit(1);
}

async function testS3() {
  console.log('\n🔧 S3 Configuration Test\n');
  console.log('Settings:');
  console.log(`  Region: ${AWS_REGION}`);
  console.log(`  Bucket: ${S3_BUCKET}`);
  console.log(`  Access Key: ${AWS_ACCESS_KEY_ID.substring(0, 8)}...`);
  console.log(`  Secret Key: ${AWS_SECRET_ACCESS_KEY.substring(0, 8)}...\n`);

  try {
    // Create S3 client
    const s3 = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      }
    });

    console.log('📤 Uploading test file to S3...');

    // Upload a test file
    const testKey = `logos/test-${Date.now()}.txt`;
    const testContent = 'Test file from S3 connection test';

    await s3.send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: testKey,
      Body: Buffer.from(testContent),
      ContentType: 'text/plain',
    }));

    const url = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${testKey}`;

    console.log('\n✅ S3 upload successful!');
    console.log(`File uploaded to: ${url}`);
    console.log('\n💡 Try opening this URL in your browser to verify public access works.\n');
    console.log('If you get "Access Denied", check your bucket policy.\n');

  } catch (error) {
    console.error('\n❌ S3 test failed:');
    console.error(error.message);
    console.error('\nCommon issues:');
    console.error('  - Wrong AWS credentials');
    console.error('  - Wrong region');
    console.error('  - Wrong bucket name');
    console.error('  - IAM user lacks s3:PutObject permission\n');
    process.exit(1);
  }
}

testS3();
