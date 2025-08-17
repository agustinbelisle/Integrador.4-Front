import React, { useEffect } from "react";
import { Formik, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { login, register, clearError } from "../../redux/slices/authSlice";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  StyledForm,
  StyledField,
  ErrorText,
  Button,
  SecondaryButton,
} from "../Modal/ModalStyles";

const LoginForm = ({ from }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector((state) => state.auth);
  const [isRegisterMode, setIsRegisterMode] = React.useState(false);

  const initialValues = { name: "", email: "", password: "" };

  const validationSchema = Yup.object({
    name: Yup.string().when("isRegisterMode", {
      is: true,
      then: Yup.string().required("Requerido"),
    }),
    email: Yup.string().email("Email inválido").required("Requerido"),
    password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
  });

const handleSubmit = async (values, { setSubmitting }) => {
  try {
    if (isRegisterMode) {
      await dispatch(register(values)).unwrap();
    } else {
      await dispatch(login(values)).unwrap();
    }
  } catch (error) {
    // Aquí podés manejar errores si querés
  } finally {
    setSubmitting(false);
  }
};


  useEffect(() => {
    if (isAuthenticated) {
      navigate(from);
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        context={{ isRegisterMode }}
      >
        {({ isSubmitting }) => (
          <StyledForm>
            {isRegisterMode && (
              <div>
                <StyledField type="text" name="name" placeholder="Nombre" />
                <ErrorMessage name="name" component={ErrorText} />
              </div>
            )}

            <div>
              <StyledField
                type="email"
                name="email"
                placeholder="Correo electrónico"
              />
              <ErrorMessage name="email" component={ErrorText} />
            </div>

            <div>
              <StyledField
                type="password"
                name="password"
                placeholder="Contraseña"
              />
              <ErrorMessage name="password" component={ErrorText} />
            </div>

            {error && <ErrorText>{error}</ErrorText>}

            <Button type="submit" disabled={isSubmitting}>
              {isRegisterMode ? "Registrarse" : "Iniciar sesión"}
            </Button>

            <SecondaryButton
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                dispatch(clearError());
              }}
            >
              {isRegisterMode
                ? "¿Ya tenés cuenta? Iniciar sesión"
                : "¿No tenés cuenta? Registrate"}
            </SecondaryButton>
          </StyledForm>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;

