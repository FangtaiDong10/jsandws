export class Modal {
  constructor(contentId, fallbackText) {
    this.fallbackText = fallbackText;
    this.contentTemplateEl = document.getElementById(contentId);
    this.modalTemplateEl = document.getElementById("modal-template");
  }

  show() {
    if ("content" in document.createElement("template")) {
      // deep copy which includes the decendents of the element
      // copy
      const modalElements = document.importNode(
        this.modalTemplateEl.content,
        true
      );

      // modal class element and backdorp class element
      this.modalElement = modalElements.querySelector(".modal");
      this.backdropElement = modalElements.querySelector(".backdrop");

      // copy
      const contentElement = document.importNode(
        this.contentTemplateEl.content,
        true
      );

      // add to the page wrapping by modal template
      this.modalElement.append(contentElement);

      document.body.insertAdjacentElement("afterbegin", this.modalElement);
      document.body.insertAdjacentElement("afterbegin", this.backdropElement);
    } else {
      alert(this.fallbackText);
    }
  }
  hide() {
    if (this.modalElement) {
      document.body.removeChild(this.modalElement); // this.modalElement.remove()
      document.body.removeChild(this.backdropElement);
      this.modalElement = null;
      this.backdropElement = null;
    }
  }
}
