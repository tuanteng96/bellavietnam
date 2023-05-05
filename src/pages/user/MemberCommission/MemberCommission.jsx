import React from "react";
import { Link, Navbar, Page, Toolbar } from "framework7-react";
import { SERVER_APP } from "../../../constants/config";
import NotificationIcon from "../../../components/NotificationIcon";
import ToolBarBottom from "../../../components/ToolBarBottom";
import CommissionItem from "./CommissionItem";
import { getUser } from "../../../constants/user";
import UserService from "../../../service/user.service";
import { arrayToTree } from "performant-array-to-tree";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      CurrentAff: {}
    };
  }
  componentDidMount() {
    this.getListTree();
  }

  getListTree = () => {
    let User = getUser();
    if (User) {
      UserService.getFtree({ MemberID: User.ID })
        .then(({ data }) => {
          let newLevels = [
            {
              parentId: null,
              id: User.ID,
              level: 0,
            },
          ];
          let index = 0;
          for (let level of data.Levels) {
            if (level.Members && level.Members.length > 0) {
              for (let member of level.Members) {
                index += 1;
                newLevels.push({
                  ...member,
                  level: level.Level,
                  index: index,
                  parentId: member.FParentID,
                  id: member.ID,
                });
              }
            }
          }
          const TreeList = arrayToTree(newLevels, {
            dataField: null,
          });
          this.setState({
            data:
              TreeList &&
              TreeList[0].children &&
              TreeList[0].children.length > 0
                ? TreeList[0].children
                : [],
            CurrentAff: {
              ...User,
              TotalChild: data.TotalChild,
              TotalChildF0:
                TreeList && TreeList[0].children && TreeList[0].children.length || 0,
            },
          });
        })
        .catch((err) => console.log(err));
    }
  };

  async loadRefresh(done) {
    done();
  }

  render() {
    const { data, CurrentAff } = this.state;
    
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
              <span className="title">Thành viên & hoa hồng</span>
            </div>
            <div className="page-navbar__noti noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        <div className="h-100 position-relative">
          <div
            className="position-relative"
            style={{ background: "#f1f1f1", padding: "15px" }}
          >
            <div className="text-center fw-600">
              {CurrentAff?.FullName}
              <span className="pl-5px">
                - Tổng {CurrentAff?.TotalChild} thành viên
              </span>
            </div>
            <div className="text-center fw-600">
              (F1) - {CurrentAff?.TotalChildF0} thành viên
            </div>
          </div>
          {data &&
            data.map((item, index) => (
              <CommissionItem key={index} data={item} />
            ))}
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
