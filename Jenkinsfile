pipeline {
    agent any

    tools {
        maven 'MAVEN_HOME'
    }

    environment {
        SONARQUBE = 'SonarQubeServer' // nom de l'outil SonarQube dans Jenkins
        DOCKER_IMAGE = 'studentdashboard-image'
    }

    stages {
        stage('Clone') {
            steps {
                git 'https://github.com/sarraelheni/jenkins.git'
            }
        }

        stage('Build avec Maven') {
            steps {
                sh 'mvn clean install'
            }
        }

        stage('Analyse SonarQube') {
            steps {
                withSonarQubeEnv("${SONARQUBE}") {
                    sh 'mvn sonar:sonar'
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }
    }
}




