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
import { toast } from "react-toastify";
import CopyToClipboard from "react-copy-to-clipboard";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      memberInfo: {},
      isLoading: true,
      showPreloader: false,
      code: "",
    };
  }
  componentDidMount() {
    // const username = infoUser.MobilePhone
    //   ? infoUser.MobilePhone
    //   : infoUser.UserName;
    // const password = getPassword();
    this.getCodeShare();
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

  getCodeShare = () => {
    let User = getUser();
    if (!User) return;
    else {
      let dataPost = {
        FLink: {
          CreateMemberID: User.ID,
          MemberID: User.ID,
        },
      };
      UserService.getFlink(dataPost).then(({ data }) => {
        this.setState({ code: data.FLink.Code });
      });
    }
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
    const { memberInfo, isLoading, code } = this.state;
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
              {code && (
                <div className="text-center mt-12px">
                  <CopyToClipboard
                    text={code}
                    onCopy={() => {
                      toast.success("Copy mã thành công !", {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 1000,
                      });
                    }}
                  >
                    <div className="d--if bg-ezs fw-400 text-white rounded-sm overflow-hidden">
                      <div className="px-10px py-5px font-size-xs">
                        Mã giới thiệu
                      </div>
                      <div
                        className="d-flex ai--c px-8px"
                        style={{ background: "var(--ezs-color-gradient)" }}
                      >
                        {code}
                      </div>
                      <button className="w-auto border-0 font-size-lg">
                        <i className="las la-copy"></i>
                      </button>
                    </div>
                  </CopyToClipboard>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="page-detail-profile h-auto">
          <div className="page-detail-profile__box">
            <Link href="/order/" className="page-detail-profile__item">
              <div className="name">Quản lý đơn hàng</div>
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
            <Link href="/affiliate/" className="page-detail-profile__item">
              <div className="name">Chính sách Affiliate</div>
              <div className="content">
                <div className="content-text">
                  <i className="las la-angle-right"></i>
                </div>
              </div>
            </Link>
            <Link href="/commission/" className="page-detail-profile__item">
              <div className="name">Thành viên & Hoa hồng</div>
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
