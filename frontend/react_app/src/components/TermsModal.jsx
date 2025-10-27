import React from "react";

const TermsModal = ({ type, id }) => {
  let title = "";
  let content = "";

  if (type === "terms") {
    title = "Términos y Condiciones";
    content = `
Bienvenido a la plataforma Emprende, desarrollada y administrada por Datablitz, con sede en Lima, Perú. 
El acceso y uso de este sitio web, así como los servicios ofrecidos, están sujetos a la aceptación plena de los presentes Términos y Condiciones.

1. Objeto: Emprende es una plataforma orientada a apoyar a emprendedores en la gestión y crecimiento de sus negocios. Al registrarse, el usuario obtiene acceso a herramientas de análisis, simulación y contacto con entidades financieras aliadas.

2. Registro y cuenta de usuario: El usuario garantiza que toda la información proporcionada en el registro es veraz, completa y actualizada. Es responsabilidad del usuario mantener la confidencialidad de sus credenciales de acceso.

3. Uso autorizado: El usuario se compromete a utilizar los servicios de forma lícita y adecuada, quedando prohibido su uso con fines fraudulentos, ilícitos o que vulneren derechos de terceros.

4. Responsabilidad: Datablitz no se hace responsable por interrupciones temporales del servicio, pérdida de información por causas externas o el mal uso de la plataforma por parte del usuario.

5. Modificaciones: Datablitz podrá actualizar o modificar estos Términos en cualquier momento, notificando a los usuarios por los canales disponibles.

El uso continuado de la plataforma implica la aceptación de las actualizaciones realizadas.
    `;
  } else if (type === "privacy") {
    title = "Política de Privacidad";
    content = `
En Datablitz valoramos y respetamos la privacidad de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos la información personal proporcionada a través de la plataforma Emprende.

1. Datos recopilados: Podemos solicitar datos como nombre, correo electrónico, número de teléfono, geolocalización, credenciales de acceso y otra información necesaria para la prestación del servicio.

2. Finalidad: Los datos se utilizan para la creación de cuentas, personalización de la experiencia, mejora continua de los servicios, comunicación con el usuario y cumplimiento de obligaciones legales.

3. Confidencialidad: La información será tratada de forma confidencial y no será compartida con terceros no autorizados, salvo por obligación legal o autorización expresa del usuario.

4. Seguridad: Implementamos medidas técnicas y organizativas para proteger los datos personales contra accesos no autorizados, pérdida o alteración.

5. Derechos del usuario: El usuario puede solicitar en cualquier momento el acceso, actualización, rectificación o eliminación de sus datos personales, conforme a la normativa vigente en Perú (Ley N° 29733).

Al aceptar esta política, el usuario otorga su consentimiento informado para el tratamiento de sus datos conforme a los fines descritos.
    `;
  } else if (type === "dataPolicy") {
    title = "Política de Tratamiento de Datos con Fines Adicionales";
    content = `
En el marco de nuestros servicios, Datablitz podrá realizar el tratamiento de los datos personales proporcionados por el usuario para fines adicionales, siempre con su consentimiento previo, libre y expreso.

1. Finalidad adicional: Además del uso principal descrito en la Política de Privacidad, los datos podrán ser compartidos con bancos, financieras y entidades aliadas con el fin de ofrecer productos, créditos, programas de financiamiento y beneficios ajustados al perfil del usuario.

2. Contacto directo: Datablitz podrá comunicarse con el usuario vía correo electrónico, mensajes de texto o llamadas telefónicas con el propósito de acercar oportunidades comerciales, educativas o financieras.

3. Cesión de datos: La información del usuario podrá ser transferida a terceros autorizados bajo acuerdos de confidencialidad y exclusivamente para fines compatibles con los descritos en este documento.

4. Derechos del usuario: El usuario podrá revocar su consentimiento en cualquier momento, sin efectos retroactivos, y ejercer sus derechos de acceso, rectificación, cancelación y oposición.

Al aceptar esta política, el usuario autoriza expresamente a Datablitz a tratar y compartir sus datos personales con fines adicionales, en beneficio de obtener mejores oportunidades de financiamiento y desarrollo empresarial.
    `;
  }

  return (
    <dialog id={id} style={{ maxWidth: "800px", padding: "30px", borderRadius: "12px" }}>
      <h2 style={{ marginBottom: "15px", fontSize: "1.6rem", color: "#2A9D8F" }}>{title}</h2>
      <div style={{ maxHeight: "400px", overflowY: "auto", whiteSpace: "pre-line", fontSize: "1rem", lineHeight: "1.6", color: "#333" }}>
        {content}
      </div>
      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button
          onClick={() => document.getElementById(id).close()}
          style={{
            background: "linear-gradient(135deg, #2A9D8F 0%, #64C9B7 100%)",
            border: "none",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          Cerrar
        </button>
      </div>
    </dialog>
  );
};

export default TermsModal;
