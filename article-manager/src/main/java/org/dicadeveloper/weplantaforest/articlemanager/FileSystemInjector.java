package org.dicadeveloper.weplantaforest.articlemanager;

import java.io.File;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component(value = "fileSystemInjector")
public class FileSystemInjector {

    @Autowired
    Environment env;

    public static String UPLOAD_DIR = "/ipat_uploads";

    public static String IMAGE_DIR = "/images";

    public static String ARTICLE_DIR = "/articles";

    private static String topFolder;

    @PostConstruct
    private void inject() {
        Runnable treeInjector = new Runnable() {

            @Override
            public void run() {
                topFolder = env.getProperty("upload.root");

                new File(topFolder).mkdir();
                new File(topFolder + UPLOAD_DIR).mkdir();
                new File(topFolder + UPLOAD_DIR + IMAGE_DIR).mkdir();
                new File(topFolder + UPLOAD_DIR + IMAGE_DIR + ARTICLE_DIR).mkdir();
            }
        };
        Thread thread = new Thread(treeInjector);
        thread.start();
    }

    public static String getArticleFolder() {
        return topFolder + UPLOAD_DIR + IMAGE_DIR + ARTICLE_DIR;
    }
}
