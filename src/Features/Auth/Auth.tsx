import React, { FC, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { User } from "../../Interfaces/user.interface";
import * as Yup from "yup";
import http from "../../Services/api";
import { saveToken, setAuthState } from "./authSlice";
import { setUser } from "./userSlice";
import { AuthResponse } from "../../Services/Mirage/Routes/user";
import { useAppDispatch } from "../../store";
import { Grid, TextField, Button } from "@material-ui/core";
import Error from "./Error";

const initialValues: User = {
  username: "",
  password: "",
  email: "",
};

const validationSchema = Yup.object({
  username: Yup.string().required("Required"),
  email: Yup.string().required("Required").email("Invalid Email"),
  password: Yup.string().required("Required"),
});

const Auth: FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <div className="loginPage">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values: User) => {
          const path = isLogin ? "/auth/login" : "/auth/signup";
          http
            .post<User, AuthResponse>(path, values)
            .then((res) => {
              if (res) {
                console.log(res);
                const { user, token } = res;
                dispatch(saveToken(token));
                dispatch(setUser(user));
                dispatch(setAuthState(true));
              }
            })
            .catch((error) => {
              console.log(error);
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      >
        {(formik) => {
          return (
            <Form>
              <Grid
                container
                spacing={3}
                justify="center"
                className="loginForm"
              >
                <Grid item sm={8} xs={10} className="formAlign">
                  <h1>{isLogin ? "Login" : "SignUp"}</h1>
                </Grid>

                <Grid item sm={8} xs={10}>
                  <Field
                    name="username"
                    as={TextField}
                    label="User Name"
                    variant="outlined"
                    helperText={
                      <ErrorMessage name="username" component={Error} />
                    }
                    InputLabelProps={{ className: "textfield__label" }}
                    InputProps={{ className: "textfield" }}
                    fullWidth
                  />
                </Grid>

                <Grid item sm={8} xs={10}>
                  {!isLogin && (
                    <Field
                      name="email"
                      as={TextField}
                      label="E-mail"
                      variant="outlined"
                      helperText={
                        <ErrorMessage name="email" component={Error} />
                      }
                      InputLabelProps={{ className: "textfield__label" }}
                      InputProps={{ className: "textfield" }}
                      fullWidth
                    />
                  )}
                </Grid>

                <Grid item sm={8} xs={10}>
                  <Field
                    name="password"
                    as={TextField}
                    label="Password"
                    variant="outlined"
                    type="password"
                    helperText={
                      <ErrorMessage name="password" component={Error} />
                    }
                    InputLabelProps={{ className: "textfield__label" }}
                    InputProps={{ className: "textfield" }}
                    fullWidth
                  />
                </Grid>
                <Grid item sm={8} xs={10} className="formAlign">
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    size="large"
                    disabled={loading}
                  >
                    {isLogin ? "Login" : "Create Account"}
                  </Button>
                  <span
                    className="account_Link"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin
                      ? "No account ? Create One"
                      : "Already have an account ?"}
                  </span>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Auth;
