import React, {Component} from 'react';

import {Router, Route, browserHistory} from 'react-router';

import counterpart from 'counterpart';
import Translate from 'react-translate-component';

import NavBar from './common/navbar/NavBar';
import Header from './common/header/Header';
import Footer from './common/footer/Footer';

import MainPage from './main/MainPage';
import ProposalPlantPage from './planting/proposalPlantPage/ProposalPlantPage';
import SliderPlantPage from './planting/sliderPlantPage/SliderPlantPage';
import CustomPlantPage from './planting/customPlantPage/CustomPlantPage';
import NotFoundPage from './views/NotFoundPage';
import ExplorePage from './views/ExplorePage';
import ProjectDetailsPage from './project/ProjectDetailsPage';
import ProfilePage from './profile/ProfilePage';
import ToolsPage from './profile/ToolsPage';
import ReceiptsPage from './profile/ReceiptsPage';
import RankingPage from './ranking/RankingPage';
import ProjectOfferPage from './offer/ProjectOfferPage';
import SelfPlantPage from './selfPlant/SelfPlantPage';
import PlantBagPage from './plantBag/PlantBagPage';
import PaymentPage from './payment/PaymentPage';
import RegistrationPage from './registration/RegistrationPage';
import ActivationPage from './activation/ActivationPage';
import ForgotPasswordPage from './password/forgotPassword/ForgotPasswordPage';
import ResetPasswordPage from './password/resetPassword/ResetPasswordPage';
import GiftOverview from './gifts/overview/GiftOverview';
import RedeemGiftPage from './gifts/redeem/RedeemGiftPage';
import FindTreePage from './findTree/FindTreePage';
import ProjectsPage from './projects/ProjectsPage';
import StatisticsPage from './statistics/StatisticsPage';
import TeamPage from './team/TeamPage';
import BlogPage from './blog/BlogPage';
import BlogOverviewPage from './blog/BlogOverviewPage';
import SuccessCC from './payment/SuccessCC';
import ErrorCC from './payment/ErrorCC';
import LoadableCo2Calculator from './co2/LoadableCo2Calculator';
import FAQ from './faq/FaqView';
import AboutUs from './common/footer/pages/AboutUs';
import Award from './common/footer/pages/Award';
import Links from './common/footer/pages/Links';
import Disclaimer from './common/footer/pages/Disclaimer';
import Financial from './common/footer/pages/Financial';
import Privacy from './common/footer/pages/Privacy';
import TreeService from './common/footer/pages/TreeService';
import Terms from './common/footer/pages/Terms';
import Imprint from './common/footer/pages/Imprint';
import Contact from './common/footer/pages/Contact';
import Social from './common/footer/pages/Social';
import Partner from './common/footer/pages/Partner';
import BackOfficeOverview from './backOffice/BackOfficeOverview';
import ArticleManager from './backOffice/articleManager/ArticleManager';
import ArticleCreater from './backOffice/articleManager/ArticleCreater';
import ArticleEditor from './backOffice/articleManager/ArticleEditor';
import CartOverview from './backOffice/cartManager/CartOverview';
import UserOverview from './backOffice/userManager/UserOverview';
import ProjectOverview from './backOffice/projectManager/ProjectOverview';
import ProjectEditor from './backOffice/projectManager/ProjectEditor';
import TreeTypeOverview from './backOffice/treeTypeManager/TreeTypeOverview';
import PlantManager from './backOffice/plantManager/PlantManager';
import SliderImageManager from './backOffice/sliderImageManager/SliderImageManager';
import EventOverview from './backOffice/eventManager/EventOverview';
import EventEditor from './backOffice/eventManager/EventEditor';


export default class Routes extends Component {

  componentDidMount() {}

  reRender() {
    this.forceUpdate();
  }

  updatePlantBag(price, projectItems, projectName, isGift) {
    this.refs['navbar'].updatePlantBag(price, projectItems, projectName, isGift);
  }

  updatePlantBagFromLocaleStorage() {
    this.refs['navbar'].updatePlantBagFromLocaleStorage();
  }

  updateNavbarComponents() {
    this.refs['navbar'].updateComponents();
  }

  resetPlantBag() {
    this.refs['navbar'].resetPlantBag();
  }

  switchLocale(locale) {
    counterpart.setLocale(locale);
    location.reload();
  }

  render() {
    counterpart.registerTranslations('de', require('counterpart/locales/de'));
    counterpart.registerTranslations('en', require('./locales/en'));
    counterpart.registerTranslations('de', require('./locales/de'));
    counterpart.setLocale(localStorage.getItem('language') == 'ENGLISH'
      ? 'en'
      : 'de');
    return (
      <div>
        <NavBar ref="navbar" reRender={this.reRender.bind(this)} switchLocale={this.switchLocale}/>
        <Header/>
        <Router history={browserHistory}>
          <Route path="/" component={MainPage} reRender={this.reRender.bind(this)}/>
          <Route path="/plant/:amount" component={ProposalPlantPage} updatePlantBag={this.updatePlantBag.bind(this)} reRender={this.reRender.bind(this)} header="online pflanzen" isGift={false} isAbo={false}/>
          <Route path="/plant3" component={CustomPlantPage} updatePlantBag={this.updatePlantBag.bind(this)} reRender={this.reRender.bind(this)} header="online pflanzen" isGift={false} isAbo={false}/>
          <Route path="/plantGift/:amount" component={ProposalPlantPage} updatePlantBag={this.updatePlantBag.bind(this)} reRender={this.reRender.bind(this)} header="Gutschein erstellen" isGift={true} isAbo={false}/>
          <Route path="/plantGift2" component={CustomPlantPage} updatePlantBag={this.updatePlantBag.bind(this)} reRender={this.reRender.bind(this)} header="Gutschein erstellen" isGift={true} isAbo={false}/>
          <Route path="/projects" component={ProjectsPage} reRender={this.reRender.bind(this)}/>
          <Route path="/projects/:projectName" component={ProjectDetailsPage} updatePlantBag={this.updatePlantBag.bind(this)} reRender={this.reRender.bind(this)}/>
          <Route path="/user/:userName" component={ProfilePage} reRender={this.reRender.bind(this)}/>
          <Route path="/tools/:username" component={ToolsPage} reRender={this.reRender.bind(this)}/>
          <Route path="/receipts/:username" component={ReceiptsPage} reRender={this.reRender.bind(this)}/>
          <Route path="/ranking" component={RankingPage} reRender={this.reRender.bind(this)}/>
          <Route path="/projectOffer" component={ProjectOfferPage} reRender={this.reRender.bind(this)}/>
          <Route path="/selfPlant" component={SelfPlantPage} reRender={this.reRender.bind(this)}/>
          <Route path="/plantBag" component={PlantBagPage} reRender={this.reRender.bind(this)} updatePlantBag={this.updatePlantBagFromLocaleStorage.bind(this)}/>
          <Route path="/payCart/:cartId" component={PaymentPage} reRender={this.reRender.bind(this)} updateComponents={this.updateNavbarComponents.bind(this)} resetPlantBag={this.resetPlantBag.bind(this)}/>
          <Route path="/payGift/:cartId/:giftId" component={PaymentPage} reRender={this.reRender.bind(this)} updateComponents={this.updateNavbarComponents.bind(this)} resetPlantBag={this.resetPlantBag.bind(this)}/>
          <Route path="/registration" component={RegistrationPage} reRender={this.reRender.bind(this)}/>
          <Route path="/userActivation" component={ActivationPage} reRender={this.reRender.bind(this)}/>
          <Route path="/forgotPassword" component={ForgotPasswordPage} reRender={this.reRender.bind(this)}/>
          <Route path="/password_reset" component={ResetPasswordPage} reRender={this.reRender.bind(this)}/>
          <Route path="/gifts/:userName" component={GiftOverview} reRender={this.reRender.bind(this)}/>
          <Route path="/gift/redeem" component={RedeemGiftPage} reRender={this.reRender.bind(this)}/>
          <Route path="/certificate/find" component={FindTreePage} reRender={this.reRender.bind(this)}/>
          <Route path="/statistics" component={StatisticsPage} reRender={this.reRender.bind(this)}/>
          <Route path="/team/:teamName" component={TeamPage} reRender={this.reRender.bind(this)}/>
          <Route path="/blog/:articleId" component={BlogPage} reRender={this.reRender.bind(this)}/>
          <Route path="/blog" component={BlogOverviewPage} reRender={this.reRender.bind(this)}/>
          <Route path="/payCC/succes/:cartId" component={SuccessCC} reRender={this.reRender.bind(this)}/>
          <Route path="/payCC/error/:cartId" component={ErrorCC} reRender={this.reRender.bind(this)}/>
          <Route path="/co2Calculator" component={LoadableCo2Calculator} reRender={this.reRender.bind(this)}/>
          <Route path="/faq" component={FAQ} reRender={this.reRender.bind(this)}/>
          <Route path="/AboutUs" component={AboutUs} reRender={this.reRender.bind(this)}/>
          <Route path="/award" component={Award} reRender={this.reRender.bind(this)}/>
          <Route path="/links" component={Links} reRender={this.reRender.bind(this)}/>
          <Route path="/disclaimer" component={Disclaimer} reRender={this.reRender.bind(this)}/>
          <Route path="/financials" component={Financial} reRender={this.reRender.bind(this)}/>
          <Route path="/privacy" component={Privacy} reRender={this.reRender.bind(this)}/>
          <Route path="/treeService" component={TreeService} reRender={this.reRender.bind(this)}/>
          <Route path="/imprint" component={Imprint} reRender={this.reRender.bind(this)}/>
          <Route path="/contact" component={Contact} reRender={this.reRender.bind(this)}/>
          <Route path="/partner" component={Partner} reRender={this.reRender.bind(this)}/>
          <Route path="/social" component={Social} reRender={this.reRender.bind(this)}/>
          <Route path="/terms" component={Terms} reRender={this.reRender.bind(this)}/>
          <Route path="/backOffice" component={BackOfficeOverview} reRender={this.reRender.bind(this)}/>
          <Route path="/article-manager" component={ArticleManager} reRender={this.reRender.bind(this)}/>
          <Route path="/article-create" component={ArticleCreater} reRender={this.reRender.bind(this)}/>
          <Route path="/article-edit/:articleId" component={ArticleEditor} reRender={this.reRender.bind(this)}/>
          <Route path="/cart-manager" component={CartOverview} reRender={this.reRender.bind(this)}/>
          <Route path="/user-manager" component={UserOverview} reRender={this.reRender.bind(this)}/>
          <Route path="/project-manager" component={ProjectOverview} reRender={this.reRender.bind(this)}/>
          <Route path="/project-edit/:projectId" component={ProjectEditor} reRender={this.reRender.bind(this)}/>
          <Route path="/treeType-manager" component={TreeTypeOverview} reRender={this.reRender.bind(this)}/>
          <Route path="/plant-manager" component={PlantManager} reRender={this.reRender.bind(this)} updatePlantBag={this.updatePlantBag.bind(this)}/>
          <Route path="/slider-image-manager" component={SliderImageManager} reRender={this.reRender.bind(this)}/>
          <Route path="/event-manager" component={EventOverview} reRender={this.reRender.bind(this)}/>
          <Route path="/event/:eventId" component={EventEditor} reRender={this.reRender.bind(this)} updatePlantBag={this.updatePlantBag.bind(this)}/>
          <Route path="*" component={NotFoundPage} reRender={this.reRender.bind(this)} updatePlantBag={this.updatePlantBag.bind(this)} isGift={false} isAbo={false}/>
        </Router>
        <Footer/>
      </div>
    );
  }
};
