
# Adam - Cookie cutter repo for new services

<img src="https://103fm.maariv.co.il/download/highlight/SegmentImgNew_466906_21_7_.jpg"/>

This is template repository backed in the basic serverless setup. batteries included.

---- 
# Tooling: 
| Tool | Description |
| --- | --- |
| [pylint](https://en.wikipedia.org/wiki/Pylint) | Quality checker(linter) |
| [black](https://black.now.sh/?version=stable&state=_Td6WFoAAATm1rRGAgAhARYAAAB0L-Wj4AA-ACxdAD2IimZxl1N_W1ktIvcnCRyy7Oc4ixQmD9R1SN_bxXCM1mkoGKOm3mJEqDjgAKkU-E21cgugAAFIPxtdQK4ftvN9AQAAAAAEWVo=) | Code formatting |
| [circleci](https://circleci.com/docs/) | CI + CD |
| [cdk](https://docs.aws.amazon.com/cdk/latest/guide/home.html) | AWS Cloud Development Kit  |
| [Serverless framework](https://serverless.com/) | Deploying serverless functions framework |
| [Pipenv](https://github.com/pypa/pipenv) | Python Development Workflow |
| [pytest](https://docs.pytest.org/en/latest/) | Python test framework |
| [Github templating](https://help.github.com/en/articles/creating-issue-templates-for-your-repository) | Tempaltes for issues PR's and repository setting (see .github folder)  |
| [Docker](https://amenityllc.atlassian.net/wiki/spaces/ResearchAndDevelopment/pages/2831450114/How+To+Dockerize+Your+Service) | Basic Dockerfile to create image and run container  |



---
**Create a new project guide** 

1. Click here [Use this template](https://github.com/amenityllc/adam/generate)
2. Replace all of adam strings in files: `find . -type f -exec sed -i "s/adam/NEW_SERVICE_NAME/g" {} \;`
3. Create Slack channel and attach incoming email address to it
4. `sed -i "s/ChangeMe/token/g" cdkapp.ts` with the token we generated in step 3
5. Go to project in [circle ci](https://circleci.com/gh/amenityllc) and `add project`


