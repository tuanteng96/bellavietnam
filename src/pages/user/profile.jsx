import React from "react";
import bgImage from "../../assets/images/headerbottombgapp.png";
import imgWallet from "../../assets/images/wallet.svg";
import imgLocation from "../../assets/images/location.svg";
import imgOrder from "../../assets/images/order.svg";
import imgDiary from "../../assets/images/diary.svg";
import imgCoupon from "../../assets/images/coupon.svg";
import imgEvaluate from "../../assets/images/evaluate.svg";
import { checkAvt } from "../../constants/format";
import { getUser, getPassword, app_request } from "../../constants/user";
import { Page, Link, Toolbar, Row, Col, f7 } from "framework7-react";
import ToolBarBottom from "../../components/ToolBarBottom";
import UserService from "../../service/user.service";
import Skeleton from "react-loading-skeleton";
import {
  REMOVE_BADGE,
  SEND_TOKEN_FIREBASE,
  SET_BADGE,
} from "../../constants/prom21";
import { iOS } from "../../constants/helpers";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      memberInfo: {},
      isLoading: true,
      showPreloader: false,
    };
  }
  componentDidMount() {
    // const username = infoUser.MobilePhone
    //   ? infoUser.MobilePhone
    //   : infoUser.UserName;
    // const password = getPassword();
    UserService.getInfo()
      .then(({ data }) => {
        if (data.error) {
          this.$f7router.navigate("/login/");
        } else {
          this.setState({
            memberInfo: data,
            isLoading: false,
          });
        }
      })
      .catch((err) => console.log(err));
  }
  signOut = () => {
    const $$this = this;
    $$this.$f7.dialog.confirm(
      "Bạn muốn đăng xuất khỏi tài khoản ?",
      async () => {
        f7.dialog.preloader(`Đăng xuất ...`);
        SEND_TOKEN_FIREBASE().then(async (response) => {
          if (!response.error && response.Token) {
            const { ID, acc_type } = getUser();
            await UserService.authRemoveFirebase({
              Token: response.Token,
              ID: ID,
              Type: acc_type,
            });
          } else {
            app_request("unsubscribe", "");
          }
          iOS() && REMOVE_BADGE();
          await localStorage.clear();
          await new Promise((resolve) => setTimeout(resolve, 800));
          f7.dialog.close();
          $$this.$f7router.navigate("/", {
            reloadCurrent: true,
          });
        });
      }
    );
  };

  checkMember = (memberInfo) => {
    if (!memberInfo) return false;
    if (memberInfo.acc_type === "M") {
      return memberInfo.acc_group > 0
        ? memberInfo.MemberGroups[0].Title
        : "Thành viên";
    }
    if (memberInfo.ID === 1) {
      return "ADMIN";
    }
    if (memberInfo.acc_type === "U" && memberInfo.GroupTitles.length > 0) {
      return memberInfo.GroupTitles.join(", ");
    }
  };

  loadRefresh(done) {
    setTimeout(() => {
      this.$f7.views.main.router.navigate(this.$f7.views.main.router.url, {
        reloadCurrent: true,
      });
      this.setState({
        showPreloader: true,
      });
      done();
    }, 600);
  }

  render() {
    const { memberInfo, isLoading } = this.state;
    return (
      <Page
        name="profile-list"
        className="bg-white"
        noNavbar
        ptr
        infiniteDistance={50}
        infinitePreloader={this.state.showPreloader}
        onPtrRefresh={this.loadRefresh.bind(this)}
      >
        <div className="profile-bg">
          <div className="page-login__back">
            <Link onClick={() => this.$f7router.back()}>
              <i className="las la-arrow-left"></i>
            </Link>
          </div>
          <div className="name">{memberInfo && memberInfo.FullName}</div>
          <div className="profile-bg__logout">
            <Link onClick={() => this.signOut()}>
              <i className="las la-sign-out-alt"></i>
            </Link>
          </div>
          <img src={bgImage} />
        </div>
        <div className="profile-info">
          <div className="profile-info__avatar">
            {isLoading ? (
              <Skeleton circle={true} height={90} width={90} />
            ) : (
              <img src={checkAvt(memberInfo && memberInfo.Photo)} />
            )}

            <Link noLinkClass href="/detail-profile/">
              <i className="las la-pen"></i>
            </Link>
          </div>
          {isLoading ? (
            <div className="profile-info__basic border-bottom">
              <div className="name">
                <Skeleton width={100} count={1} />
              </div>
              <div className="group">
                <Skeleton width={120} count={1} />
              </div>
            </div>
          ) : (
            <div className="profile-info__basic border-bottom">
              <div className="name">{memberInfo && memberInfo.FullName}</div>
              <div className="group">
                {this.checkMember(memberInfo && memberInfo)}
              </div>
            </div>
          )}
        </div>
        <div className="page-detail-profile h-auto">
          <div className="page-detail-profile__box">
            <Link href="/detail-profile/" className="page-detail-profile__item">
              <div className="name">Thông tin cá nhân</div>
              <div className="content">
                <div className="content-text">
                  <i className="las la-angle-right"></i>
                </div>
              </div>
            </Link>
            <Link href="/wallet/" className="page-detail-profile__item">
              <div className="name">Ví điện tử</div>
              <div className="content">
                <div className="content-text">
                  <i className="las la-angle-right"></i>
                </div>
              </div>
            </Link>
            <Link href="/order/" className="page-detail-profile__item">
              <div className="name">Đơn hàng</div>
              <div className="content">
                <div className="content-text">
                  <i className="las la-angle-right"></i>
                </div>
              </div>
            </Link>
            <Link href="/voucher/" className="page-detail-profile__item">
              <div className="name">Mã giảm giá</div>
              <div className="content">
                <div className="content-text">
                  <i className="las la-angle-right"></i>
                </div>
              </div>
            </Link>
            <Link href="/affiliate/" className="page-detail-profile__item">
              <div className="name">Chính sách Affiliate</div>
              <div className="content">
                <div className="content-text">
                  <i className="las la-angle-right"></i>
                </div>
              </div>
            </Link>
            <Link href="/maps/" className="page-detail-profile__item pb-0">
              <div className="name">Liên hệ</div>
              <div className="content">
                <div className="content-text">
                  <i className="las la-angle-right"></i>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
