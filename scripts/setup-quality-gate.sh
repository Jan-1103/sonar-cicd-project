#!/usr/bin/env bash
# Creates a custom Quality Gate and assigns it to the project.
# Usage: SONAR_HOST_URL=http://localhost:9000 SONAR_TOKEN=<admin-token> ./scripts/setup-quality-gate.sh
set -euo pipefail
HOST="${SONAR_HOST_URL:-http://localhost:9000}"
GATE="CICD-Strict-Gate"
PROJECT="devops-sonar-demo"
api() { curl -sf -u "${SONAR_TOKEN}:" -X POST "$HOST/api/$1" "${@:2}"; }

api qualitygates/create -d "name=$GATE" || echo "Gate may already exist"
api qualitygates/create_condition -d "gateName=$GATE" -d "metric=coverage" -d "op=LT" -d "error=80"
api qualitygates/create_condition -d "gateName=$GATE" -d "metric=bugs" -d "op=GT" -d "error=0"
api qualitygates/create_condition -d "gateName=$GATE" -d "metric=vulnerabilities" -d "op=GT" -d "error=0"
api qualitygates/create_condition -d "gateName=$GATE" -d "metric=duplicated_lines_density" -d "op=GT" -d "error=3"
api projects/create -d "project=$PROJECT" -d "name=DevOps Sonar Demo" || echo "Project may already exist"
api qualitygates/select -d "gateName=$GATE" -d "projectKey=$PROJECT"
echo "Quality Gate '$GATE' (coverage>=80%, 0 bugs, 0 vulnerabilities, duplication<=3%) assigned to $PROJECT"
