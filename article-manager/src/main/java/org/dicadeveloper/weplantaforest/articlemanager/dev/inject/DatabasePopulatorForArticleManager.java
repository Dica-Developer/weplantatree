package org.dicadeveloper.weplantaforest.articlemanager.dev.inject;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Random;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dicadeveloper.weplantaforest.articlemanager.FileSystemInjector;
import org.dicadeveloper.weplantaforest.articlemanager.articles.Article;
import org.dicadeveloper.weplantaforest.articlemanager.articles.Article.ArticleType;
import org.dicadeveloper.weplantaforest.articlemanager.articles.ArticleRepository;
import org.dicadeveloper.weplantaforest.articlemanager.articles.Paragraph;
import org.dicadeveloper.weplantaforest.articlemanager.articles.ParagraphRepository;
import org.dicadeveloper.weplantaforest.articlemanager.user.User;
import org.dicadeveloper.weplantaforest.articlemanager.user.UserRepository;
import org.dicadeveloper.weplantaforest.common.support.Language;
import org.dicadeveloper.weplantaforest.common.support.TimeConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.collect.ImmutableList;

/**
 * Provides the functionality to easily populate the database with test data.
 */
@Service
public class DatabasePopulatorForArticleManager {

    protected final Log LOG = LogFactory.getLog(DatabasePopulatorForArticleManager.class.getName());

    private final static List<String> DEFAULT_USERS = ImmutableList.of("admin", "Martin", "Sebastian", "Johannes", "Gab&uuml;r", "Micha", "Christian", "Sven", "Axl", "Philipp", "Adam", "Bert",
            "Claus", "Django", "Emil", "Mr NoTree");

    public final static String DUMMY_IMAGE_FOLDER = "src/test/resources/images/";

    private UserRepository _userRepository;

    private ArticleRepository _articleRepository;

    private ParagraphRepository _parapgraphRepository;

    @Autowired
    public DatabasePopulatorForArticleManager(ArticleRepository articleRepository, ParagraphRepository paragraphRepository, UserRepository userRepository) {
        _articleRepository = articleRepository;
        _userRepository = userRepository;
        _parapgraphRepository = paragraphRepository;
    }

    public DatabasePopulatorForArticleManager insertUsers() {
        DEFAULT_USERS.forEach((userName) -> {
            if (_userRepository.findByName(userName) == null) {
                User user = new User();
                user.setName(userName);
                user.setEnabled(true);
                _userRepository.save(user);
            }
        });
        return this;
    }

    public DatabasePopulatorForArticleManager insertArticles() {
        Random random = new Random();
        int articleCount = 1;
        for (ArticleType articleType : ArticleType.values()) {
            for (int i = 0; i < 5; i++) {

                int pickOne = random.nextInt(4);

                Article article = new Article();
                article.setOwner(_userRepository.findByName(DEFAULT_USERS.get(pickOne)));
                article.setArticleType(articleType);
                article.setLang(Language.DEUTSCH);
                article.setShowFull(true);
                article.setCreatedOn(TimeConstants.YEAR_IN_MILLISECONDS * (i + 1) * 5);
                article.setTitle("this is article nr " + i + " from " + articleType.toString() + " article");
                article.setIntro("<p>this is an article about " + articleType.toString() + "</p>");
                article.setImageFileName("article" + articleCount + ".jpg");
                article.setImageDescription("imageDesc for article" + articleCount);
                article.setVisible(true);
                _articleRepository.save(article);
                articleCount++;
            }
        }
        return this;
    }

    public DatabasePopulatorForArticleManager insertParagraphsToArticles() {
        for (Article article : _articleRepository.findAll()) {
            for (int i = 0; i < 3; i++) {
                Paragraph paragraph = new Paragraph();
                paragraph.setArticle(article);
                paragraph.setTitle("this is the paragraph nr " + (i + 1));
                paragraph.setText("this is a paragraph about a lot of blabla(" + (i + 1) + ")");
                if (i == 1) {
                    paragraph.setImageFileName("test.jpg");
                }
                _parapgraphRepository.save(paragraph);
            }
        }

        return this;
    }

    public DatabasePopulatorForArticleManager addImagesToArticleFolder() {
        int articleCnt = 1;
        for (Article article : _articleRepository.findAll()) {
            if (articleCnt > 3) {
                articleCnt = 1;
            }

            long articleId = article.getId();
            String imageSrcName = "article" + articleCnt + ".jpg";
            String imageDestName = "article" + articleId + ".jpg";

            Path imageFileSrc = new File(DUMMY_IMAGE_FOLDER + imageSrcName).toPath();
            String imageFileDest = FileSystemInjector.getArticleFolder() + "/" + imageDestName;

            createImageFileAndCopySrcFileIntoIt(imageFileSrc, imageFileDest);

            articleCnt++;
        }

        return this;
    }

    private void createImageFileAndCopySrcFileIntoIt(Path srcPath, String destPath) {
        try {
            File newImageFile = new File(destPath);
            newImageFile.createNewFile();
            Files.copy(srcPath, newImageFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e1) {
            LOG.error("Error occured while copying " + srcPath.toString() + " to " + destPath + "!");
        }
    }

}
