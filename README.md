# SonarQube in CI/CD – Quality Gate Enforcement

Node.js app with two components (`src/backend` API, `src/frontend` UI), Jest tests with coverage,
SonarQube analysis, and a pipeline that **blocks deployment if the Quality Gate fails**.

## 1. Start SonarQube
```bash
docker compose -f docker-compose.sonar.yml up -d
```
Open http://localhost:9000 (login admin/admin, change password).
Create a token: My Account > Security > Generate Token (type: User or Global Analysis).

## 2. Create the Quality Gate
```bash
SONAR_HOST_URL=http://localhost:9000 SONAR_TOKEN=<token> ./scripts/setup-quality-gate.sh
```
Gate rules: coverage >= 80%, 0 bugs, 0 vulnerabilities, duplication <= 3%.

## 3. Run locally first
```bash
npm ci && npm test
npx sonar-scanner -Dsonar.host.url=http://localhost:9000 -Dsonar.token=<token>
```

## 4A. GitHub Actions
Add repo secrets `SONAR_TOKEN` and `SONAR_HOST_URL`. Use a self-hosted runner if SonarQube is on localhost
(or expose it with a public URL / use SonarCloud). Push to `main`.
Flow: build-and-test -> sonarqube-analysis (waits for gate) -> deploy.

## 4B. Jenkins (alternative)
Install plugins: SonarQube Scanner, NodeJS, Pipeline. Configure:
- Manage Jenkins > System > SonarQube servers: name `SonarQube`, URL, token credential
- Tools: NodeJS `node20`, SonarQube Scanner `SonarScanner`
- SonarQube > Administration > Configuration > Webhooks: `http://<jenkins>/sonarqube-webhook/`
- Create a Pipeline job from SCM using the `Jenkinsfile`.

## 5. Proof / Evidence to capture
**Run A – PASS:** push clean code. Screenshot: SonarQube dashboard (Passed), pipeline green incl. Deploy stage, `docker ps`.
**Run B – FAIL:** `cp demo/bad-code.js src/backend/bad-code.js`, commit and push.
Screenshot: SonarQube dashboard (Failed + failing conditions), pipeline red at Quality Gate stage,
Deploy stage skipped/not run. Then delete the file and push to restore green.

Evidence checklist: Quality Gate configuration page, Passed analysis, Failed analysis (issues list),
pipeline run logs for both, proof that deploy did not run on failure.
