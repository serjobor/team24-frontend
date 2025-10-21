import Editor from 'react-simple-wysiwyg';
import styles from "./MyEditor.module.css";
import { Context } from "@main";
import { observer } from "mobx-react-lite";
import { useContext } from "react";

const MyEditor = () => {

  const { adminStore } = useContext(Context);

  return (
    <>
      <label htmlFor="text" className={styles.label}>
        Тема письма:
      </label>
      <input
        id="input"
        value={adminStore.templateSubject}
        onChange={(e) => adminStore.setTemplateSubject(e.target.value)}
        className={styles.input}
        placeholder="Введите тему письма..."
      />

      <label className={styles.label} htmlFor="html-textarea">
        Текст письма:
      </label>

      <Editor
        value={adminStore.templateBody}
        onChange={(e) => adminStore.setTemplateBody(e.target.value)}
        placeholder="Введите текст письма..."
      />
    </>
  );
}

export default observer(MyEditor);