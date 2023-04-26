import React from "react";
import { SERVER_APP } from "./../../constants/config";
import { Page, Link, Toolbar } from "framework7-react";
import UserService from "../../service/user.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getStockIDStorage,
  setStockIDStorage,
  setStockNameStorage,
  setUserLoginStorage,
  setUserStorage,
} from "../../constants/user";
import SelectStock from "../../components/SelectStock";
import { SEND_TOKEN_FIREBASE } from "../../constants/prom21";
import { setSubscribe } from "../../constants/subscribe";
import { Formik, Form } from "formik";
import clsx from "clsx";
import * as Yup from "yup";

toast.configure();

const sendSchema = Yup.object().shape({
  fn: Yup.string().required("Vui lòng nhập."),
  regphone: Yup.string().required("Vui lòng nhập."),
  fcode: Yup.string().required("Vui lòng nhập."),
  p1: Yup.string().required("Vui lòng nhập."),
});

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      fullname: "",
      password: "",
      phone: "",
      arrNews: [],
      arrBanner: [],
      isOpenStock: false,
      isReload: 0,
    };
  }

  onSubmit = (values) => {
    var bodyFormData = new FormData();
    bodyFormData.append("regname", values.regname);
    bodyFormData.append("p1", values.p1);
    bodyFormData.append("rp1", values.p1);
    bodyFormData.append("address", values.address);
    bodyFormData.append("fn", values.fn);
    bodyFormData.append("regphone", values.regphone);
    bodyFormData.append("byStockID", values.byStockID);
    bodyFormData.append("api", values.api);
    bodyFormData.append("fcode", values.fcode);

    const stockId = getStockIDStorage();

    if (!stockId) {
      this.setState({
        isOpenStock: !this.state.isOpenStock,
      });
      return;
    }

    const self = this;
    self.$f7.preloader.show();

    UserService.register2(bodyFormData)
      .then(({ data }) => {
        if (data.error) {
          toast.error(
            data.error === "Chưa có mã giới thiệu"
              ? "Mã giới thiệu không chính xác !"
              : data.error,
            {
              position: toast.POSITION.TOP_LEFT,
              autoClose: 2000,
            }
          );
          self.$f7.preloader.hide();
        } else {
          toast.success("Đăng ký thành công.", {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 500,
            onClose: () => {
              this.onLogin(data?.m?.MobilePhone, values.p1);
            },
          });
        }
      })
      .catch((e) => console.log(e));
  };

  onLogin = (username, password) => {
    const self = this;
    UserService.login(username, password)
      .then(({ data }) => {
        if (data.error) {
          self.$f7.preloader.hide();
          toast.error("Tài khoản & mật khẩu không chính xác !", {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 3000,
          });
          this.setState({
            password: "",
          });
        } else {
          const userData = data;
          const token = userData.token;
          setUserStorage(token, userData);
          SEND_TOKEN_FIREBASE().then(async (response) => {
            if (!response.error && response.Token) {
              await UserService.authSendTokenFirebase({
                Token: response.Token,
                ID: userData.ID,
                Type: userData.acc_type,
              });
              setTimeout(() => {
                self.$f7.preloader.hide();
                this.$f7router.navigate("/", {
                  animate: true,
                  transition: "f7-flip",
                });
              }, 300);
            } else {
              setSubscribe(userData, () => {
                setTimeout(() => {
                  self.$f7.preloader.hide();
                  this.$f7router.navigate("/", {
                    animate: true,
                    transition: "f7-flip",
                  });
                }, 300);
              });
            }
            userData?.ByStockID && setStockIDStorage(userData.ByStockID);
            userData?.StockName && setStockNameStorage(userData.StockName);
            setUserLoginStorage(username, password);
          });
        }
      })
      .catch((e) => console.log(e));
  };

  handleChangeInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  phoneChange = (e) => {
    const val = e.target.value;
    if (e.target.validity.valid) this.setState({ phone: e.target.value });
    else if (val === "" || val === "-") this.setState({ phone: val });
  };

  isImage = (icon) => {
    const ext = [".jpg", ".jpeg", ".bmp", ".gif", ".png", ".svg"];
    return ext.some((el) => icon.endsWith(el));
  };

  getClassStyle = () => {
    if (window?.GlobalConfig?.APP?.Login?.Background) {
      if (this.isImage(window?.GlobalConfig?.APP?.Login?.Background)) {
        document.documentElement.style.setProperty(
          "--login-background",
          `url(${window?.GlobalConfig?.APP?.Login?.Background})`
        );
        return "bg-login-img";
      } else {
        document.documentElement.style.setProperty(
          "--login-background",
          window?.GlobalConfig?.APP?.Login?.Background
        );
        return "bg-login";
      }
    }
    return "";
  };

  render() {
    const { isLoading, isOpenStock, password, isReload } = this.state;
    return (
      <Page noNavbar noToolbar name="login">
        <div className="page-wrapper page-login">
          <div className="page-login__back">
            <Link onClick={() => this.$f7router.back()}>
              <i className="las la-arrow-left"></i>
            </Link>
          </div>
          <div className={`page-login__content ${this.getClassStyle()}`}>
            <div className="page-login__logo">
              <div className="logo" style={{ marginTop: "40px" }}>
                <img
                  className="logo-reg"
                  src={SERVER_APP + "/app/images/logo-app.png"}
                />
              </div>
              <div className="title">Xin chào, Bắt đầu tạo tài khoản nào</div>
            </div>
            <div className="page-login__form">
              <Formik
                initialValues={{
                  regname: "",
                  p1: "",
                  rp1: "",
                  address: "",
                  fn: "",
                  regphone: "",
                  byStockID: getStockIDStorage(),
                  api: "1",
                  fcode: "",
                }}
                onSubmit={this.onSubmit}
                enableReinitialize={true}
                validationSchema={sendSchema}
              >
                {(formikProps) => {
                  const {
                    values,
                    touched,
                    errors,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                  } = formikProps;

                  return (
                    <Form>
                      <div className="title">Tạo tài khoản mới</div>
                      <div className="page-login__form-item">
                        <input
                          type="text"
                          name="fn"
                          autoComplete="off"
                          value={values.fn}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Họ và tên"
                          className={clsx(
                            errors.fn &&
                              touched.fn &&
                              "is-invalid solid-invalid"
                          )}
                        />
                      </div>
                      <div className="page-login__form-item">
                        <input
                          type="text"
                          value={values.regphone}
                          name="regphone"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Số điện thoại"
                          className={clsx(
                            errors.regphone &&
                              touched.regphone &&
                              "is-invalid solid-invalid"
                          )}
                        />
                      </div>
                      <div className="page-login__form-item">
                        <input
                          type="text"
                          value={values.fcode}
                          name="fcode"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Mã giới thiệu"
                          className={clsx(
                            errors.fcode &&
                              touched.fcode &&
                              "is-invalid solid-invalid"
                          )}
                        />
                      </div>
                      <div className="page-login__form-item">
                        <input
                          type="password"
                          value={values.p1}
                          name="p1"
                          autoComplete="off"
                          placeholder="Mật khẩu"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={clsx(
                            errors.p1 &&
                              touched.p1 &&
                              "is-invalid solid-invalid"
                          )}
                        />
                      </div>
                      <div className="page-login__form-item">
                        <button
                          type="submit"
                          className={
                            "btn-login btn-me" +
                            (isLoading === true ? " loading" : "")
                          }
                        >
                          <span>Đăng ký</span>
                        </button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
          <div className="page-login__alert">
            Bạn đã có tài khoản ? <Link href="/login/">Đăng nhập</Link>
          </div>
        </div>
        <SelectStock
          isOpenStock={isOpenStock}
          //nameStock={(name) => this.nameStock(name)}
          isReload={isReload}
        />
      </Page>
    );
  }
}
