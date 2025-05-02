pipeline {
    agent any

    environment {
        SONARQUBE = 'SonarQube'
        DOCKER_IMAGE = 'studentdashboard-image'
    }

    stages {
        stage('Cloner le projet') {
            steps {
                git 'https://github.com/sarraelheni/jenkins.git'
            }
        }

        stage('Compilation avec Maven') {
            steps {
                sh 'mvn clean install'
            }
        }

        stage('Analyse avec SonarQube') {
            steps {
                withSonarQubeEnv("${SONARQUBE}") {
                    sh 'mvn sonar:sonar'
                }
            }
        }

        stage('Création image Docker') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }
    }
}
