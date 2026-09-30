pipeline {
    agent any
    environment {
        IMAGE = "cesar449/mi-sitio"
        TAG   = "${BUILD_NUMBER}"
    }
    triggers { pollSCM('H/2 * * * *') }
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Build') {
            steps { sh 'docker build -t $IMAGE:$TAG -t $IMAGE:latest .' }
        }
        stage('Test') {
            steps {
                sh '''
                docker rm -f test-$BUILD_NUMBER || true
                docker run -d --name test-$BUILD_NUMBER -p 9090:8080 $IMAGE:$TAG
                sleep 3
                curl -f http://localhost:9090/
                '''
            }
            post { always { sh 'docker rm -f test-$BUILD_NUMBER || true' } }
        }
        stage('Security Scan') {
            steps {
                sh 'docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --severity HIGH,CRITICAL --exit-code 0 $IMAGE:$TAG'
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                docker network create red-web || true
                docker rm -f web || true
                docker run -d --name web --network red-web --restart unless-stopped \
                  -p 8081:8080 \
                  --read-only \
                  --tmpfs /tmp:uid=101,gid=101 \
                  --tmpfs /var/cache/nginx:uid=101,gid=101 \
                  --tmpfs /var/run:uid=101,gid=101 \
                  --cap-drop ALL --security-opt no-new-privileges \
                  $IMAGE:$TAG
                sleep 5
                curl -f http://localhost:8081/
                '''
            }
        }
    }
    post {
        success { echo 'Despliegue exitoso' }
        failure { echo 'Pipeline falló' }
    }
}
