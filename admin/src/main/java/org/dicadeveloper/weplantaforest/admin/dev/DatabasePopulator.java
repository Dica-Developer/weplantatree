package org.dicadeveloper.weplantaforest.admin.dev;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Iterator;
import java.util.List;
import java.util.Random;

import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dicadeveloper.weplantaforest.admin.FileSystemInjector;
import org.dicadeveloper.weplantaforest.admin.cart.Cart;
import org.dicadeveloper.weplantaforest.admin.cart.CartItem;
import org.dicadeveloper.weplantaforest.admin.cart.CartRepository;
import org.dicadeveloper.weplantaforest.admin.cart.CartState;
import org.dicadeveloper.weplantaforest.admin.project.Price;
import org.dicadeveloper.weplantaforest.admin.project.Price.ScontoType;
import org.dicadeveloper.weplantaforest.admin.project.PriceRepository;
import org.dicadeveloper.weplantaforest.admin.project.Project;
import org.dicadeveloper.weplantaforest.admin.project.ProjectArticle;
import org.dicadeveloper.weplantaforest.admin.project.ProjectArticleRepository;
import org.dicadeveloper.weplantaforest.admin.project.ProjectImage;
import org.dicadeveloper.weplantaforest.admin.project.ProjectImageRepository;
import org.dicadeveloper.weplantaforest.admin.project.ProjectRepository;
import org.dicadeveloper.weplantaforest.admin.tree.Tree;
import org.dicadeveloper.weplantaforest.admin.tree.TreeRepository;
import org.dicadeveloper.weplantaforest.admin.treeType.TreeType;
import org.dicadeveloper.weplantaforest.admin.treeType.TreeTypeRepository;
import org.dicadeveloper.weplantaforest.admin.user.User;
import org.dicadeveloper.weplantaforest.admin.user.UserRepository;
import org.dicadeveloper.weplantaforest.common.support.TimeConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.Iterators;

import lombok.NonNull;

/**
 * Provides the functionality to easily populate the database with test data.
 */
@Service
public class DatabasePopulator {

    protected final Log LOG = LogFactory.getLog(DatabasePopulator.class.getName());

    private final static List<String> DEFAULT_TREE_TYPES = ImmutableList.of("Buche", "Kiefer", "Birke", "Ahorn", "Eiche", "Esche", "Linde", "Wildapfel", "Robinie", "Espe", "Default");

    private final static List<String> DEFAULT_USERS = ImmutableList.of("admin", "Martin", "Sebastian", "Johannes", "Gab&uuml;r", "Micha", "Christian", "Sven", "Axl", "Philipp", "Adam", "Bert",
            "Claus", "Django", "Emil", "Mr NoTree");

    public final static String DUMMY_IMAGE_FOLDER = "src/test/resources/images/";

    private ProjectRepository _projectRepository;
    private UserRepository _userRepository;
    private TreeTypeRepository _treeTypeRepository;
    private TreeRepository _treeRepository;
    private ProjectArticleRepository _projectArticleRepository;
    private CartRepository _cartRepository;
    private PriceRepository _priceRepository;
    private ProjectImageRepository _projectImageRepository;

    @Autowired
    private @NonNull Environment _env;

    @Autowired
    public DatabasePopulator(ProjectRepository projectRepository, UserRepository userRepository, TreeTypeRepository treeTypeRepository, TreeRepository treeRepository,
            ProjectArticleRepository projectArticleRepository, PriceRepository priceRepository, CartRepository cartRepository, ProjectImageRepository projectImageRepository) {
        _projectRepository = projectRepository;
        _userRepository = userRepository;
        _treeTypeRepository = treeTypeRepository;
        _treeRepository = treeRepository;
        _projectArticleRepository = projectArticleRepository;
        _cartRepository = cartRepository;
        _priceRepository = priceRepository;
        _projectImageRepository = projectImageRepository;
    }

    public DatabasePopulator insertProjects() {
        for (int i = 0; i < 10; i++) {

            String projectName = "Project " + (i + 1) + " von " + DEFAULT_USERS.get(i);
            Project project = new Project();
            project.setName(projectName);
            project.setManager(_userRepository.findByName(DEFAULT_USERS.get(i)));
            project.setDescription(
                    "<mlpr>GERMAN<equ><p>Projektbeschreibung</p><sep>ENGLISH<equ><p>project description</p><sep>ITALIAN<equ>projecto descriptiones<sep>");
            project.setImageFileName("project" + (i + 1) + ".jpg");
            if (i < 5) {
                project.setShopActive(false);
                project.setVisible(false);
            } else {
                project.setShopActive(true);
                project.setVisible(true);
            }
            switch (i) {
            case 0:
                project.setLatitude(52.4626536896816f);
                project.setLongitude(13.607287460327143f);
                break;
            case 1:
                project.setLatitude(37.235000f);
                project.setLongitude(-115.811111f);
                break;
            case 2:
                project.setLatitude(52.4626536896816f);
                project.setLongitude(13.607287460327143f);
                break;
            case 3:
                project.setLatitude(52.4626536896816f);
                project.setLongitude(13.607287460327143f);
                break;
            case 4:
                project.setLatitude(52.4626536896816f);
                project.setLongitude(13.607287460327143f);
                break;
            case 5:
                project.setLatitude(52.4626536896816f);
                project.setLongitude(13.607287460327143f);
                break;
            case 6:
                project.setLatitude(52.4626536896816f);
                project.setLongitude(13.607287460327143f);
                break;
            case 7:
                project.setLatitude(52.4626536896816f);
                project.setLongitude(13.607287460327143f);
                break;
            case 8:
                project.setLatitude(52.4626536896816f);
                project.setLongitude(13.607287460327143f);
                break;
            default:
                project.setLatitude(51.482691f);
                project.setLongitude(11.969947f);
                break;
            }
            _projectRepository.save(project);
        }
        return this;
    }
    
    public DatabasePopulator insertProjectImages() {
        for (int i = 1; i <= 10; i++) {
            for (int j = 1; j <= 5; j++) {
                ProjectImage projectImage = new ProjectImage();
                projectImage.setTitle("image " + j);
                projectImage.setDescription("<mlpr>GERMAN<equ>Bildbeschreibung " + j  +"<sep>ENGLISH<equ>image description " + j  +"<sep>ITALIAN<equ>projecto descriptiones<sep>");
                projectImage.setImageFileName("project" + i + "_" + j + ".jpg");
                projectImage.setDate(100000000L * j);
                projectImage.setProject(_projectRepository.findOne((long) i));
                _projectImageRepository.save(projectImage);
            }
        }

        return this;
    }

    public DatabasePopulator insertDefaultTreeTypes() {
        DEFAULT_TREE_TYPES.forEach((treeTypeName) -> {
            TreeType treeType = _treeTypeRepository.findByName(treeTypeName);
            if (null == treeType) {
                final String description = "Die " + treeTypeName
                        + " bilden eine Pflanzengattung in der Unterfamilie der Rosskastaniengewächse (Hippocastanoideae) innerhalb der Familie der Seifenbaumgewächse (Sapindaceae). ";
                treeType = new TreeType();
                treeType.setName(treeTypeName);
                treeType.setDescription(description);
                double co2Savings = 0.02;
                switch (treeTypeName) {
                case "Robin":
                case "Wildapfel":
                    co2Savings = 0.01;
                    break;
                case "Default":
                    co2Savings = 0.011;
                    break;
                }
                treeType.setAnnualCo2SavingInTons(co2Savings);
                treeType.setImageFile(treeTypeName + ".jpeg");
                _treeTypeRepository.save(treeType);

            }
        });
        return this;
    }

    public DatabasePopulator insertUsers() {
        long timeNoew = System.currentTimeMillis();

        for (int i = 0; i < DEFAULT_USERS.size(); i++) {
            User user = new User();
            user.setName(DEFAULT_USERS.get(i));
            user.setEnabled(true);
            user.setRegDate(timeNoew - (i + 1) * TimeConstants.YEAR_IN_MILLISECONDS);
            user.setMail(DEFAULT_USERS.get(i) + "@" + DEFAULT_USERS.get(i) + ".de");
            _userRepository.save(user);
        }
        return this;
    }

    public DatabasePopulator insertTrees(int count) {
        Iterator<ProjectArticle> cyclingProjectArticles = Iterators.cycle(loadProjectArticles());
        long timeOfPlant = System.currentTimeMillis();

        ProjectArticle articleToPlant = cyclingProjectArticles.next();
        for (int i = 0; i < count; i++) {
            if (i > 0 && i % 15 == 0) {
                articleToPlant = cyclingProjectArticles.next();
            }

            Tree treeDto = new Tree();
            treeDto.setAmount(i % 20 + 1);
            treeDto.setLatitude(i);
            treeDto.setLongitude(i);
            treeDto.setTreeType(articleToPlant.getTreeType());
            treeDto.setPlantedOn(timeOfPlant - i * 100000000L);
            treeDto.setOwner(_userRepository.findByName(DEFAULT_USERS.get(i % 15)));
            treeDto.setProjectArticle(articleToPlant);
            _treeRepository.save(treeDto);
        }
        return this;
    }

    public DatabasePopulator insertProjectArticles() {
        for (Project project : _projectRepository.findAll()) {
            for (int i = 0; i < 5; i++) {
                Price price = createPrice();

                ProjectArticle plantArticle = new ProjectArticle();
                plantArticle.setTreeType(_treeTypeRepository.findByName(DEFAULT_TREE_TYPES.get(i)));
                plantArticle.setProject(project);
                plantArticle.setPrice(price);
                plantArticle.setAmount(10000L);
                _projectArticleRepository.save(plantArticle);
            }
        }
        return this;
    }

    private Iterable<ProjectArticle> loadProjectArticles() {
        return _projectArticleRepository.findAll();
    }

    private Price createPrice() {
        Price price = new Price();
        Random random = new Random();

        double randomPrice = random.nextDouble() * 6;
        double randomMarge = randomPrice / 2;

        price.setAmount(new BigDecimal(randomPrice));
        price.setScontoType(ScontoType.NONE);
        price.setMarge(new BigDecimal(randomMarge));
        _priceRepository.save(price);
        return price;
    }

    @Transactional
    public DatabasePopulator insertCarts() {
        for (int i = 0; i < 1000; i++) {
            Cart cart = new Cart();
            User buyer = _userRepository.findByName(DEFAULT_USERS.get(i % 10));

            cart.setBuyer(buyer);
            cart.setCartState(CartState.values()[i % 5]);
            cart.setCallBackVorname(DEFAULT_USERS.get(i % 10));
            cart.setCallBackNachname("Nachname");
            cart.setCallBackFirma(DEFAULT_USERS.get(i % 10) + " Industries");
            Tree tree = new Tree();
            ProjectArticle projectArticle = _projectArticleRepository.findOne(1L);
            tree.setAmount(i % 10 + 1);
            tree.setProjectArticle(projectArticle);
            tree.setTreeType(projectArticle.getTreeType());
            tree.setOwner(buyer);

            CartItem cartItem = new CartItem();
            cartItem.setTree(tree);

            cart.addCartItem(cartItem);

            _cartRepository.save(cart);
        }

        return this;
    }
    
    public DatabasePopulator addMainImagesToProjectFolder() {
        for (int i = 1; i <= _projectRepository.count(); i++) {
            String mainImageFileName = "project" + i + ".jpg";

            Path imageFileSrc = new File(DUMMY_IMAGE_FOLDER + mainImageFileName).toPath();
            String imageFileDest = FileSystemInjector.getImageFolderForProjects() + "/" + mainImageFileName;

            createProjectImageFileAndCopySrcFileIntoIt(imageFileSrc, imageFileDest);
        }

        return this;
    }

    public DatabasePopulator addProjectImages() {
        for (int i = 0; i < _projectRepository.count(); i++) {
            for (int j = 1; j <= 5; j++) {
                String projectImageName = "project" + i + "_" + j + ".jpg";

                String imageSrcName = "project" + j + ".jpg";
                Path imageFileSrc = new File(DUMMY_IMAGE_FOLDER + imageSrcName).toPath();

                String imageFileDest = FileSystemInjector.getImageFolderForProjects() + "/" + projectImageName;

                createProjectImageFileAndCopySrcFileIntoIt(imageFileSrc, imageFileDest);
            }
        }

        return this;
    }
    
    private void createProjectImageFileAndCopySrcFileIntoIt(Path srcPath, String destPath) {
        try {
            File newImageFile = new File(destPath);
            newImageFile.createNewFile();
            Files.copy(srcPath, newImageFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e1) {
            LOG.error("Error occured while copying " + srcPath.toString() + " to " + destPath + "!");
        }
    }

}
