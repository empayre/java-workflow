# java-workflow

В репозитории хранятся общие описания для сборок java/kotlin проектов.
Сборка наших проектов бывает разной, в зависимости от типа собираемого проекта:
- Service - Maven сборка сервиса с деплоем docker image в AWS ECR
- patch-swag - Maven сборка swagger на основании патчей ([RFC 6902](https://datatracker.ietf.org/doc/html/rfc6902)) с деплоем в Apache Maven registry на Github Packages

Чтобы начать использовать `java-workflow` в своем репозитории - добавьте в директорию `/.github/workflows/` файлы
`build.yml` и `deploy.yml`, файлов описания workflow не обязательно должно быть два, вы можете самостоятельно описать workflow с использованием `java-workflow`.

Пример сборки и деплоя сервиса:

`build.yml`
```yaml
name: Maven Build Artifact

on:
  pull_request:
    branches:
      - '*'

jobs:
  build:
    uses: empayre/java-workflow/.github/workflows/maven-service-build.yml@v1
    secrets:
      action-fetch-token: ${{ secrets.ACTIONS_FETCH_TOKEN }}
      github-pkg-ro-pat: ${{ secrets.GH_PACKAGES_RO_PAT2 }}
      github-pkg-ro-user: 'empayre-bot'
```
`deploy.yml`
```yaml
name: Maven Deploy Artifact

on:
  push:
    branches:
      - 'master'
      - 'main'

jobs:
  deploy:
    uses: empayre/java-workflow/.github/workflows/maven-service-deploy.yml@v1
    secrets:
      action-fetch-token: ${{ secrets.ACTIONS_FETCH_TOKEN }}
      mm-webhook-url: ${{ secrets.MATTERMOST_WEBHOOK_URL }}
      github-pkg-ro-pat: ${{ secrets.GH_PACKAGES_RO_PAT2 }}
      github-pkg-ro-user: 'empayre-bot'
      aws-ecr-access_key: ${{ secrets.ECR_ACCESS_KEY }}
      aws-ecr-secret-key: ${{ secrets.ECR_SECRET_KEYS }}
      aws-region: ${{ secrets.AWS_REGION }}
```

Пример сборки и деплоя библотеки patch-swag:

`build.yml`
```yaml
name: Maven Build Artifact

on:
  pull_request:
    branches:
      - '*'

jobs:
  build:
    uses: empayre/java-workflow/.github/workflows/maven-patch-swag-build.yml@v1
```
`deploy.yml`
```yaml
name: Maven Deploy Artifact

on:
  push:
    branches:
      - 'master'
      - 'main'

jobs:
  deploy:
    uses: empayre/java-workflow/.github/workflows/maven-patch-swag-deploy.yml@v1
    secrets:
      mm-webhook-url: ${{ secrets.MATTERMOST_WEBHOOK_URL }}
```