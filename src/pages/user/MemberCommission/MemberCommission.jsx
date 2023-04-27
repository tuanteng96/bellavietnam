import React from "react";
import { Link, Navbar, Page, Toolbar } from "framework7-react";
import { SERVER_APP } from "../../../constants/config";
import NotificationIcon from "../../../components/NotificationIcon";
import ToolBarBottom from "../../../components/ToolBarBottom";
import CommissionItem from "./CommissionItem";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [
        {
          Title: "Nguyễn Tài Tuấn 1",
          Phone: "0971021196",
          Children: [
            {
              Title: "Nguyễn Tài Tuấn 2",
              Children: [
                {
                  Title: "Nguyễn Tài Tuấn 3",
                },
              ],
            },
          ],
        },
        {
          Title: "Nguyễn Tài Tuấn 1",
          Phone: "0971021196",
          Children: [
            {
              Title: "Nguyễn Tài Tuấn 2",
              Children: [
                {
                  Title: "Nguyễn Tài Tuấn 3",
                },
              ],
            },
          ],
        },
        {
          Title: "Nguyễn Tài Tuấn 1",
          Phone: "0971021196",
          Children: [
            {
              Title: "Nguyễn Tài Tuấn 2",
              Children: [
                {
                  Title: "Nguyễn Tài Tuấn 3",
                },
              ],
            },
          ],
        },
      ],
    };
  }
  componentDidMount() {}

  async loadRefresh(done) {
    done();
  }

  render() {
    const { data } = this.state;
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
