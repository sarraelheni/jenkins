pipeline {
    agent any  // Utilise n'importe quel agent disponible

    environment {
        SONARQUBE = 'SonarQube' // Nom de ton outil SonarQube
        SONARQUBE_TOKEN = credentials('jenkins-token') // Credentials Jenkins pour le token SonarQube
        DOCKER_IMAGE = 'studentdashboard-image' // Nom de ton image Docker
    }

    stages {
        stage('Cloner le dépôt') {
            steps {
                git branch: 'main', url: 'https://github.com/sarraelheni/school_project.git'
            }
        }

        stage('Build Maven') {
            steps {
                sh 'mvn clean install'
            }
        }

        stage('Analyse SonarQube') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh "mvn sonar:sonar -Dsonar.login=$SONARQUBE_TOKEN"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $DOCKER_IMAGE ."
            }
        }
    }

    post {
        success {
            echo 'Pipeline réussi !'
        }
        failure {
            echo 'Il y a eu une erreur dans le pipeline.'
        }
    }
}
