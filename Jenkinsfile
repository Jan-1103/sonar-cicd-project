pipeline {
  agent any
  tools { nodejs 'node20' }   // Manage Jenkins > Tools > NodeJS installation named node20
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Install') { steps { sh 'npm ci' } }
    stage('Test + Coverage') { steps { sh 'npm test' } }
    stage('SonarQube Analysis') {
      steps {
        script { scannerHome = tool 'SonarScanner' }   // Tools > SonarQube Scanner named SonarScanner
        withSonarQubeEnv('SonarQube') {                 // Configure System > SonarQube servers named SonarQube
          sh "${scannerHome}/bin/sonar-scanner"
        }
      }
    }
    stage('Quality Gate') {
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true       // fails pipeline => Deploy never runs
        }
      }
    }
    stage('Deploy') {
      when { branch 'main' }
      steps {
        sh '''
          docker build -t devops-sonar-demo:${BUILD_NUMBER} .
          docker rm -f demo-app || true
          docker run -d --name demo-app -p 3000:3000 devops-sonar-demo:${BUILD_NUMBER}
        '''
      }
    }
  }
  post {
    failure { echo 'Pipeline failed - check SonarQube Quality Gate / tests.' }
  }
}
