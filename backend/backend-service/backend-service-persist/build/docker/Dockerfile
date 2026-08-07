FROM framework/jdk:17.0

WORKDIR /opt/app/workspace

COPY target/app.jar ./target/app.jar

EXPOSE 8080

CMD ["java", "-jar", "./target/app.jar"]
