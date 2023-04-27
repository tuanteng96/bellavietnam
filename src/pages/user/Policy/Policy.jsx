import React from "react";
import {
  Link,
  Navbar,
  Page,
  Subnavbar,
  Tab,
  Tabs,
  Toolbar,
} from "framework7-react";
import Slider from "react-slick";
import ReactHtmlParser from "react-html-parser";
import NewsDataService from "../../../service/news.service";
import SkeletonNews from "../../news/SkeletonNews";
import { SERVER_APP } from "../../../constants/config";
import NotificationIcon from "../../../components/NotificationIcon";
import ToolBarBottom from "../../../components/ToolBarBottom";

import PerfectScrollbar from "react-perfect-scrollbar";

const perfectScrollbarOptions = {
  wheelSpeed: 5,
  wheelPropagation: false,
  suppressScrollY: true,
  swipeEasing: false,
};

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
      isLoading: true,
      NewTitle: null,
    };
  }
  componentDidMount() {
    this.getNewsAll();
    this.getInfoCate();
  }

  getNewsAll = () => {
    NewsDataService.getNewsIdCate("691")
      .then((response) => {
        const arrNews = response.data.data;
        this.setState({
          arrNews: arrNews.sort((a, b) => a.source.Order - b.source.Order),
          isLoading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  getInfoCate = () => {
    NewsDataService.getInfoCate("691")
      .then(({ data }) => {
        this.setState({ NewTitle: data.data });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  async loadRefresh(done) {
    this.getNewsAll(() => done());
  }

  render() {
    const { arrNews, isLoading, NewTitle } = this.state;
    return (
      <Page
        name="profile-list"
        className="bg-white"
        ptr
        infiniteDistance={50}
        onPtrRefresh={this.loadRefresh.bind(this)}
      >
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.$f7router.back()}>
                <i className="las la-angle-left"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">{NewTitle && NewTitle[0]?.Title}</span>
            </div>
            <div className="page-navbar__noti noti">
              <NotificationIcon />
            </div>
          </div>
          <Subnavbar className="subnavbar-prod">
            <PerfectScrollbar
              options={perfectScrollbarOptions}
              className="list-cate scroll-hidden scroll"
            >
              {arrNews &&
                arrNews.map((item, index) => (
                  <Link
                    tabLink={`#tab-${index}`}
                    key={index}
                    tabLinkActive={index === 0}
                  >
                    {item.source.Title}
                  </Link>
                ))}
            </PerfectScrollbar>
          </Subnavbar>
        </Navbar>
        <div className="home-page__news mb-0">
          <div className="page-news__list">
            <Tabs animated>
              {arrNews &&
                arrNews.map((item, index) => (
                  <Tab id={`tab-${index}`} tabActive={index === 0} key={index}>
                    {ReactHtmlParser(item.source.Desc)}
                    {ReactHtmlParser(item.source.Content)}
                  </Tab>
                ))}
            </Tabs>
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
