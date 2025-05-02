pipeline {
agent any
environment {
SONARQUBE_SERVER = 'SonarQubeServerName'
DOCKER_IMAGE = 'monprojet:latest'
}
stages {
stage('Cloner depuis GitHub') {
steps {
git branch: 'main', url: 'https://github.com/sarraelheni/jenkins.git'
}
}
stage('Build Maven') {
steps {
sh 'mvn clean install'
}
}
stage('Analyse SonarQube') {
steps {
withSonarQubeEnv('SonarQubeServerName') {
sh 'mvn sonar:sonar'
}
}
}
stage('Construire Image Docker') {
steps {
sh 'docker build -t monprojet:latest .'
}
}
}
}
