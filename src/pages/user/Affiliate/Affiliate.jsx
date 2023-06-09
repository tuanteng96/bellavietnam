import React from "react";
import { Link, Navbar, Page, Toolbar } from "framework7-react";
import Slider from "react-slick";
import ReactHtmlParser from "react-html-parser";
import NewsDataService from "../../../service/news.service";
import SkeletonNews from "../../news/SkeletonNews";
import { SERVER_APP } from "../../../constants/config";
import NotificationIcon from "../../../components/NotificationIcon";
import ToolBarBottom from "../../../components/ToolBarBottom";

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
  handStyle = () => {
    const _width = this.state.width - 120;
    return Object.assign({
      width: _width,
    });
  };

  getNewsAll = (callback) => {
    NewsDataService.getNewsIdCate("11202")
      .then((response) => {
        const arrNews = response.data.data;
        this.setState({
          arrNews: arrNews,
          isLoading: false,
        });
        callback && callback();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  getInfoCate = () => {
    NewsDataService.getInfoCate("11202")
      .then(({ data }) => {
        this.setState({ NewTitle: data.data });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  async loadRefresh(done) {
    this.getNewsAll(() => done());
    done();
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
        </Navbar>
        <div className="home-page__news mb-0">
          <div className="page-news__list">
            <div className="page-news__list-ul">
              {!isLoading && (
                <div>
                  {arrNews &&
                    arrNews.map((item, index) => (
                      <Link
                        href={"/news/detail/" + item.id + "/"}
                        className="page-news__list-item mb-15px"
                        key={item.id}
                      >
                        <div className="images">
                          <img
                            src={SERVER_APP + item.source.Thumbnail_web}
                            alt={item.source.Title}
                          />
                        </div>
                        <div className="text">
                          <h6>{item.source.Title}</h6>
                          <div className="desc">
                            {ReactHtmlParser(item.source.Desc)}
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              )}
              {isLoading && <SkeletonNews />}
            </div>
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
