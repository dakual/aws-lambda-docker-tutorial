### Creating AWS Lambda Role
```
aws iam create-role --role-name lambda-execute --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{ "Effect": "Allow", "Principal": {"Service": "lambda.amazonaws.com"}, 
    "Action": "sts:AssumeRole"}]
}'
```

### Create a new directory and initialise a Node project
```sh
cd lambda-docker-app
npm init -f 
```

### Build the Docker image
```sh
docker build -t my-app .   
```

### Run image and Test it locally
```sh
docker run --rm -p 8080:8080 my-app
curl -XPOST "http://localhost:8080/2015-03-31/functions/function/invocations" -d '{"a":"b"}'
aws lambda invoke \
  --region eu-central-1 \
  --endpoint http://localhost:8080 \
  --no-sign-request \
  --function-name function \
  --cli-binary-format raw-in-base64-out \
  --payload '{"message":"Hello World!"}' output.txt
```

### Push your Docker image to ECR
```sh
# Authenticate the Docker CLI to your Amazon ECR registry.
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.eu-cental-1.amazonaws.com

# Create a repository in Amazon ECR
aws ecr create-repository --repository-name my-app --image-scanning-configuration scanOnPush=true --image-tag-mutability MUTABLE

# Tag to image
docker tag my-app:latest <aws-account-id>.dkr.ecr.eu-central-1.amazonaws.com/my-app:latest 

# Deploy the image to Amazon ECR
docker push <aws-account-id>.dkr.ecr.eu-central-1.amazonaws.com/my-app:latest
```

### Create the Lambda function
```sh
aws lambda create-function \
--package-type Image \
--function-name my-app \
--role arn:aws:iam::<aws-account-id>:role/lambda-execute \
--code ImageUri=<aws-account-id>.dkr.ecr.eu-central-1.amazonaws.com/my-app:latest
```

### Invoke the Lambda functionPermalink
```sh
aws lambda \
--region eu-central-1 invoke \
--function-name my-app \
--cli-binary-format raw-in-base64-out \
--payload '{"message":"Hello World!"}' \
output.txt
```

