package org.dicadeveloper.weplantaforest;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component(value="fileSystemInjector")
public class FileSystemInjector{

    @Autowired
    Environment env;

    public static String UPLOAD_DIR = "/ipat_uploads_user";

    public static String IMAGE_DIR = "/images";

    public static String PROJECT_DIR = "/projects";

    private static String topFolder;

    @Bean
    CommandLineRunner initFolderStructure() {
        return (String[] args) -> {
            topFolder = env.getProperty("upload.root");
            new File(topFolder).mkdir();
            new File(topFolder + UPLOAD_DIR).mkdir();
            new File(topFolder + UPLOAD_DIR + IMAGE_DIR).mkdir();
            new File(topFolder + UPLOAD_DIR + IMAGE_DIR + PROJECT_DIR).mkdir();
        };
    }

    public static String getImageFolderForProjects() {
        return topFolder + UPLOAD_DIR + IMAGE_DIR + PROJECT_DIR;
    }
    
    public static String getImageUploadFolder() {
        System.out.println(topFolder);
        return topFolder + UPLOAD_DIR;
    }

}