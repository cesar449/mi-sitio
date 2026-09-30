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
                docker run -d --name test-$BUILD_NUMBER -p 9191:8080 $IMAGE:$TAG
                for i in $(seq 1 20); do
                  curl -sf http://localhost:9191/ > /dev/null && exit 0
                  sleep 2
                done
                echo "El sitio no respondio a tiempo"
                docker logs test-$BUILD_NUMBER
                exit 1
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
                for i in $(seq 1 20); do
                  curl -sf http://localhost:8081/ > /dev/null && exit 0
                  sleep 2
                done
                echo "El despliegue no respondio a tiempo"
                docker logs web
                exit 1
                '''
            }
        }
    }
    post {
        success { echo 'Despliegue exitoso' }
        failure { echo 'Pipeline falló' }
    }
}
