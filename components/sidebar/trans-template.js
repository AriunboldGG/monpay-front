import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

const TransTemplate = ({ data, setSelected }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [selectItem, setSelectItem] = useState(false);
  const [templateId, setTemplateId] = useState('');

  const { t } = useTranslation('common');
  const router = useRouter();

  const handleSelect = (e, i) => {
    setSelected(e);
    setSelectItem(e);
  };

  const handleCloseDelete = () => setShowDelete(false);

  const handleTrue = (val) => {
    setShowDelete(true);
    setTemplateId(val);
  };

  const handleDelete = (e) => {
    const body = {
      templateId: templateId,
    };
    axios.post('/api/account/transfer-to-bank-delete', body).then(
      (resp) => {
        setShowDelete(false);
        router.push('/app/dashboard');
      },
      (error) => {
        setShowDelete(false);
      }
    );
  };

  return (
    <div className="sidebar-of-content" style={{ marginTop: '24px' }}>
      <div className="sidebar-content-inner">
        <div className="sidebar-title">
          <h6>{t('trans-template')}</h6>
        </div>
        <ul className="trans-history-sidebar">
          {data?.map((template, i) => (
            <li
              className={
                selectItem === template.templateId
                  ? 'select-class-name li-item'
                  : 'li-item'
              }
              key={i}
              onClick={(e) => handleSelect(template.templateId, i)}
            >
              <div className="item-inner">
                <span>{template.templateName}</span>
                <span className="id-number">{template.destCustomerName}</span>
              </div>
              <div
                className="image"
                onClick={(e) => handleTrue(template.templateId)}
              >
                <img src="/icon-delete.svg" />
              </div>
            </li>
          ))}
          <Modal
            show={showDelete}
            onHide={() => handleCloseDelete()}
            dialogClassName="delete-template"
            centered
          >
            <Modal.Header closeButton>
              <div className="header-title">
                <h5>{t('record-delete')}</h5>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="template-body">
                <h5>{t('sure')}</h5>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div
                style={{
                  display: 'flex',
                  margin: 0,
                }}
              >
                <Button type="submit" onClick={handleDelete}>
                  {t('yes')}
                </Button>
              </div>
            </Modal.Footer>
          </Modal>
        </ul>
      </div>
    </div>
  );
};

export default TransTemplate;
