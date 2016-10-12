package org.dicadeveloper.weplantaforest.certificate;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dicadeveloper.weplantaforest.cart.Cart;
import org.dicadeveloper.weplantaforest.cart.CartRepository;
import org.dicadeveloper.weplantaforest.security.TokenAuthenticationService;
import org.dicadeveloper.weplantaforest.support.Uris;
import org.dicadeveloper.weplantaforest.trees.Tree;
import org.dicadeveloper.weplantaforest.trees.TreeRepository;
import org.dicadeveloper.weplantaforest.user.User;
import org.dicadeveloper.weplantaforest.user.UserRepository;
import org.dicadeveloper.weplantaforest.views.Views;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonView;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired) )
public class CertificateController {

    protected final static Log LOG = LogFactory.getLog(CertificateController.class.getName());

    private @NonNull CertificateRepository _certificateRepository;

    private @NonNull TreeRepository _treeRepository;

    private @NonNull UserRepository _userRepository;

    private @NonNull CartRepository _cartRepository;

    private @NonNull TokenAuthenticationService _tokenAuthenticationService;

    private final static String RELATIVE_STATIC_IMAGES_PATH = "/static/images/pdf";

    @RequestMapping(value = Uris.CERTIFICATE_SEARCH + "{certificateNumber:.+}", method = RequestMethod.GET)
    @JsonView(Views.PlantedTree.class)
    @Transactional
    public ResponseEntity<List<Tree>> findTreesForCertificateNumber(@PathVariable("certificateNumber") String certificateNumber) {
        certificateNumber = certificateNumber.replace("#", "");
        Certificate certificate = _certificateRepository.findByNumber(certificateNumber);

        if (null != certificate) {
            List<Tree> trees = new ArrayList<>();
            for (Cart cart : certificate.getCarts()) {
                trees.addAll(cart.getTrees());
            }
            return new ResponseEntity<>(trees, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = Uris.CERTIFICATE_SUMMARY + "{certificateNumber:.+}", method = RequestMethod.GET)
    @JsonView(Views.CertificateSummary.class)
    public ResponseEntity<Certificate> findCertificateText(@PathVariable("certificateNumber") String certificateNumber) {
        certificateNumber = certificateNumber.replace("#", "");
        Certificate certificate = _certificateRepository.findByNumber(certificateNumber);

        if (null != certificate) {
            return new ResponseEntity<>(certificate, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = Uris.CERTIFICATE_CREATE, method = RequestMethod.POST)
    @Transactional
    public ResponseEntity<?> createCertificate(@RequestHeader(value = "X-AUTH-TOKEN") String userToken, HttpServletResponse response, @RequestBody CertificateRequestData requestData) {
        User user = _tokenAuthenticationService.getUserFromToken(userToken);

        if (user == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            Certificate certificate = new Certificate();
            certificate.setCreator(user);
            certificate.setText(requestData.getText());

            List<Cart> carts = _cartRepository.findCartsByIdIn(requestData.getCartIds());

            for (Cart cart : carts) {
                certificate.addCart(cart);
            }

            // generate certificate number
            int certificateCountByUser = _certificateRepository.countCertificatesByUser(user.getId());
            String certificateNumber = certificate.generateAndSetNumber(certificateCountByUser);

            _certificateRepository.save(certificate);
            return new ResponseEntity<>(certificateNumber, HttpStatus.OK);
        }
    }

    @RequestMapping(value = Uris.CERTIFICATE_PDF + "{certificateNumber:.+}", method = RequestMethod.GET, headers = "Accept=application/pdf")
    @Transactional
    public ResponseEntity<?> getCertificatePdf(HttpServletResponse response, @PathVariable String certificateNumber) {
        certificateNumber = certificateNumber.replace("#", "");
        Certificate certificate = _certificateRepository.findByNumber(certificateNumber);

        if (certificate == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            int treeCount = 0;
            for (Cart cart : certificate.getCarts()) {
                treeCount += cart.getTreeCount();
            }
            PdfCertificateView pdf = new PdfCertificateView();
            try {
                pdf.writePdfDataToOutputStream(response.getOutputStream(), treeCount, certificate.getText(), certificate.getCreator().getName(), certificateNumber, RELATIVE_STATIC_IMAGES_PATH);
            } catch (Exception e) {
                LOG.error("Error occured while creating PDF!", e);
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        }

    }

}