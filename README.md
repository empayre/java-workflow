# java-workflow

В репозитории хранятся общие описания для сборок java/kotlin проектов.
Сборка наших проектов бывает разной, в зависимости от типа собираемого проекта:
- Service - Maven сборка сервиса с деплоем docker image в AWS ECR
- swag - Maven сборка swagger  с деплоем в Apache Maven registry на Github Packages

Чтобы начать использовать `java-workflow` в своем репозитории - добавьте в директорию `/.github/workflows/` файлы
`build.yml` и `deploy.yml`, файлов описания workflow не обязательно должно быть два, вы можете самостоятельно описать workflow с использованием `java-workflow`.

В репозитории есть инструменты для сканирования:
- Semgrep - сканирует по дефолтным правилам

Чтобы начать использовать инструмент - добавьте в директорию файл `semgrep-scan.yml`.

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
    uses: empayre/java-workflow/.github/workflows/maven-service-build.yml@v${version}
    secrets:
      action-fetch-token: ${{ secrets.ACTIONS_FETCH_TOKEN }}
      github-pat: ${{ secrets.GH_PACKAGES_JDKBUILD_PAT }}
      github-user: 'empayre-bot'
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
    uses: empayre/java-workflow/.github/workflows/maven-service-deploy.yml@v${version}
    secrets:
      action-fetch-token: ${{ secrets.ACTIONS_FETCH_TOKEN }}
      mm-webhook-url: ${{ secrets.MATTERMOST_WEBHOOK_URL }}
      github-pat: ${{ secrets.GH_PACKAGES_JDKBUILD_PAT }}
      github-user: 'empayre-bot'
      aws-ecr-access_key: ${{ secrets.ECR_ACCESS_KEY }}
      aws-ecr-secret-key: ${{ secrets.ECR_SECRET_KEYS }}
      aws-region: ${{ secrets.AWS_REGION }}
```

Пример сборки и деплоя библотеки swag:

`build.yml`
```yaml
name: Maven Build Artifact

on:
  pull_request:
    branches:
      - '*'

jobs:
  build:
    uses: empayre/java-workflow/.github/workflows/maven-swag-build.yml@v1
    with: 
      run-script-name: patch * 
```
\*  - для случая сборки на основе патчей ([RFC 6902](https://datatracker.ietf.org/doc/html/rfc6902))

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
    uses: empayre/java-workflow/.github/workflows/maven-swag-deploy.yml@v1
    secrets:
      mm-webhook-url: ${{ secrets.MATTERMOST_WEBHOOK_URL }}
```

Пример использования инструмента:

`semgrep-scan.yml`
```yml
name: Run Semgrep

on:
  pull_request:
    branches:
      - '*'

jobs:
  scan:
    uses: empayre/java-workflow/.github/workflows/semgrep-scan.yml@v1
    secrets:
      mm-sa-wh-url: ${{ secrets.MATTERMOST_SA_WH_URL}}
```