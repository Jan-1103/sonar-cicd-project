pipeline {
  agent any

  tools {
    nodejs 'node20'
  }

  environment {
    IMAGE_NAME = "devops-sonar-demo:${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Test + Coverage') {
      steps {
        sh 'npm test'
      }
    }

    stage('SonarQube Analysis') {
      steps {
        script {
          scannerHome = tool 'SonarScanner'
        }
        withSonarQubeEnv('SonarQube') {
          sh "${scannerHome}/bin/sonar-scanner"
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage('Build Image') {
      steps {
        sh 'docker build -t "$IMAGE_NAME" .'
      }
    }

    stage('Trivy Report') {
      steps {
        sh '''
          mkdir -p trivy-reports

          trivy image \
            --scanners vuln \
            --severity HIGH,CRITICAL \
            --format table \
            --output trivy-reports/devops-sonar-demo.txt \
            "$IMAGE_NAME"

          trivy image \
            --scanners vuln \
            --severity HIGH,CRITICAL \
            --format json \
            --output trivy-reports/devops-sonar-demo.json \
            "$IMAGE_NAME"

          echo "Trivy reports created:"
          ls -lh trivy-reports
        '''
      }
    }

    stage('Trivy Gate') {
      steps {
        sh '''
          echo "Checking image for CRITICAL vulnerabilities..."
          trivy image \
            --scanners vuln \
            --severity CRITICAL \
            --exit-code 1 \
            "$IMAGE_NAME"
        '''
      }
    }

    stage('Deploy') {
      when {
        branch 'main'
      }
      steps {
        sh '''
          docker rm -f demo-app || true
          docker run -d \
            --name demo-app \
            -p 3000:3000 \
            "$IMAGE_NAME"
        '''
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'trivy-reports/**',
                       allowEmptyArchive: true
    }
    failure {
      echo 'Pipeline failed. Check tests, SonarQube Quality Gate, or Trivy Gate.'
    }
    success {
      echo 'Pipeline completed successfully.'
    }
  }
}
