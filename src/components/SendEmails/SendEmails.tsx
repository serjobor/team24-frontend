import { observer } from "mobx-react-lite";
import styles from "./SendEmails.module.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "@main";

interface SendEmailsProps {
  onClose?: () => void;
  isPopup?: boolean;
}

function SendEmails({ onClose, isPopup = false }: SendEmailsProps) {
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const { managerStore } = useContext(Context);

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    const isValid = /\S+@\S+\.\S+/.test(trimmed);
    if (!isValid) return;
    if (emails.includes(trimmed)) return;
    setEmails(prev => [...prev, trimmed]);
    setEmail("");
  };

  const handleRemoveEmail = (toRemove: string) => {
    setEmails(prev => prev.filter(e => e !== toRemove));
  };

  const handleSend = async () => {
    if (emails.length === 0) return;
    setIsSending(true);
    try {
      // TODO: интеграция с API
      console.log("Отправка писем:", emails);

      managerStore.setCandidatEmails(emails);
      await managerStore.addNewCandidates();
      // await managerStore.getCandidates();

      if (isPopup && onClose) {
        onClose();
      } else {
        navigate("/manager");
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className={`${styles.card} ${isPopup ? styles.popup : ''}`}>
        <form onSubmit={handleAddEmail} className={styles.formRow}>
          <input
            type="email"
            className={styles.input}
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className={styles.addBtn}>Добавить</button>
        </form>

        {emails.length > 0 && (
          <div className={styles.list}>
            {emails.map((e) => (
              <div key={e} className={styles.listItem}>
                <span className={styles.emailText}>{e}</span>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemoveEmail(e)}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.button} ${styles.sendBtn}`}
          onClick={handleSend}
          disabled={isSending || emails.length === 0}
        >
          {isSending ? "Отправка..." : "Отправить"}
        </button>
      </div>
    </>
  );
}

export default observer(SendEmails)