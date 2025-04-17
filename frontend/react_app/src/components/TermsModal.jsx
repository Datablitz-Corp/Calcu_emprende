// src/components/TermsModal.jsx
function TermsModal() {
  return (
    <div
      className="modal fade"
      id="termsModal"
      tabIndex="-1"
      aria-labelledby="termsModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="termsModalLabel">
              Términos y Condiciones
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="modal-body">
            <p><strong>Fecha de entrada en vigor:</strong> [Fecha]</p>
            <p>
              Bienvenido/a a [Nombre de tu sitio web] (el "Sitio"). Por favor,
              lee atentamente estos Términos y Condiciones antes de usar nuestro
              sitio web operado por [Nombre de tu empresa o tú mismo], con
              domicilio en [Dirección].
            </p>
            <p>
              Al acceder o utilizar el Sitio, aceptas estar sujeto/a a estos
              Términos y Condiciones y cumplir con todas las leyes y
              regulaciones aplicables. Si no estás de acuerdo con alguna parte
              de estos términos, no utilices el sitio web.
            </p>
            <ol>
              <li>
                <strong>Uso del Sitio:</strong> El contenido del Sitio es
                únicamente para fines informativos. Te comprometes a no
                utilizar el sitio con fines ilegales o no autorizados. No debes
                interferir ni alterar la seguridad del sitio ni intentar acceder
                a información restringida.
              </li>
              <li>
                <strong>Propiedad Intelectual:</strong> Todo el contenido del
                Sitio, incluidos textos, gráficos, logotipos, imágenes y
                software, es propiedad de [Nombre de tu empresa] o de sus
                licenciantes, y está protegido por las leyes de propiedad
                intelectual. No se permite su reproducción sin autorización
                previa por escrito.
              </li>
              <li>
                <strong>Enlaces a Terceros:</strong> El sitio puede contener
                enlaces a sitios web de terceros. No tenemos control sobre el
                contenido ni las políticas de privacidad de dichos sitios y no
                asumimos ninguna responsabilidad por ellos.
              </li>
              <li>
                <strong>Limitación de Responsabilidad:</strong> En ningún caso
                [Nombre de tu empresa] será responsable por daños directos,
                indirectos, incidentales, especiales o consecuentes que
                resulten del uso o la imposibilidad de uso del sitio.
              </li>
              <li>
                <strong>Modificaciones:</strong> Nos reservamos el derecho de
                modificar estos Términos y Condiciones en cualquier momento.
                Cualquier cambio será efectivo inmediatamente después de su
                publicación en el sitio web. Se recomienda revisar periódicamente
                esta página para estar al tanto de los cambios.
              </li>
              <li>
                <strong>Ley Aplicable:</strong> Estos Términos se regirán e
                interpretarán de acuerdo con las leyes de [País / Estado], sin
                tener en cuenta sus disposiciones sobre conflictos de leyes.
              </li>
              <li>
                <strong>Contacto:</strong>
                <br />
                Email: [tu-email@dominio.com]
                <br />
                Teléfono: [número de contacto]
              </li>
            </ol>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsModal;
