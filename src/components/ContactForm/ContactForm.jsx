import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import axios from "axios";
import {
  FormContainer,
  InputField,
  SubmitButton,
  ErrorMessage,
} from "./ContactFormStyles";
import { toast } from 'react-toastify';


const ContactForm = () => {
  const [sending, setSending] = useState(false);

  const formik = useFormik({
    initialValues: { name: "", email: "", message: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es obligatorio"),
      email: Yup.string()
        .email("Correo inválido")
        .required("El correo es obligatorio"),
      message: Yup.string().required("El mensaje no puede estar vacío"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setSending(true);

      try {
        const res = await axios.post("http://localhost:5000/api/contact", values);

if (res.status === 200) {
  toast.success("¡Mensaje enviado con éxito 🎉!");
  resetForm();
} else {
  throw new Error("Fallo en el servidor");
}

      } 

catch (error) {
  console.error("Error al enviar el mensaje:", error);
  toast.error("Error al enviar el mensaje. Intenta nuevamente.");
}


      setSending(false);
    },
  });

  return (
    <FormContainer onSubmit={formik.handleSubmit}>
      <InputField
        type="text"
        name="name"
        placeholder="Nombre"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.name && formik.errors.name && (
        <ErrorMessage>{formik.errors.name}</ErrorMessage>
      )}

      <InputField
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.email && formik.errors.email && (
        <ErrorMessage>{formik.errors.email}</ErrorMessage>
      )}

      <InputField
        as="textarea"
        name="message"
        placeholder="Mensaje"
        value={formik.values.message}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.message && formik.errors.message && (
        <ErrorMessage>{formik.errors.message}</ErrorMessage>
      )}

      <SubmitButton type="submit" disabled={sending}>
        {sending ? "Enviando..." : "Enviar"}
      </SubmitButton>

    </FormContainer>
  );
};

export default ContactForm;
