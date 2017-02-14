package org.dicadeveloper.weplantaforest.admin.dev;

import javax.annotation.PostConstruct;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dicadeveloper.weplantaforest.admin.treeType.TreeTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DataInjector {

    protected final Log LOG = LogFactory.getLog(DataInjector.class.getName());

    protected DatabasePopulator _databasePopulator;

    private TreeTypeRepository _treeTypeRepository;

    @Autowired
    public DataInjector(TreeTypeRepository treeTypeRepository, DatabasePopulator databasePopulator) {
        _treeTypeRepository = treeTypeRepository;
        _databasePopulator = databasePopulator;
    }

    @PostConstruct
    private void inject() {
        Runnable treeInjector = new Runnable() {

            @Override
            public void run() {
                // TODO jz: Thinking about giving this an extra state table in
                // the db (like db.populates=v23)
                if (!_treeTypeRepository.existsAtAll()) {
                    int treeCount = 15000;
                    _databasePopulator.insertUsers()
                                      .insertDefaultTreeTypes()
                                      .insertProjects()
                                      .insertProjectArticles()
                                      .insertCarts()
                                      .insertProjectImages()
                                      .addMainImagesToProjectFolder()
                                      .addProjectImages()
                                      .createMainSliderImages();
                    ;
                    LOG.info("Finished injecting " + treeCount + " trees ");
                } else {
                    LOG.info("No entities will be injected.");
                }
            }
        };
        Thread thread = new Thread(treeInjector);
        thread.start();
    }
}