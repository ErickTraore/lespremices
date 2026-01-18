// AdminPresseManager.jsx - Interface CRUD pour les messages

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '../../actions/messageActions';
import './AdminPresseManager.css';

const USER_API = process.env.REACT_APP_USER_API;
const MEDIA_API = process.env.REACT_APP_MEDIA_API;

const AdminPresseManager = () => {
  const dispatch = useDispatch();
  const messages = useSelector((s) => s.messages.messages);
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', link: '', attachment: '' });
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [messageMedia, setMessageMedia] = useState({});

  useEffect(() => { dispatch(fetchMessages()); }, [dispatch]);

  useEffect(() => {
    if (!messages || messages.length === 0) return;
    
    const loadMedia = async () => {
      const media = {};
      for (const msg of messages) {
        try {
          const res = await fetch(`${MEDIA_API}/getMedia/${msg.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
          });
          if (res.ok) {
            const data = await res.json();
            // Normaliser les chemins comme dans PresseList
            const normalized = (Array.isArray(data) ? data : []).map(f => ({
              ...f,
              path: f.path ? f.path.replace("/usr/src/app/uploads", "/media-backend") : ""
            }));
            media[msg.id] = normalized;
          }
        } catch (err) { 
          console.error(`Erreur média ${msg.id}:`, err); 
        }
      }
      setMessageMedia(media);
    };
    loadMedia();
  }, [messages]);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const resetForm = () => {
    setFormData({ title: '', content: '', link: '', attachment: '' });
    setImageFile(null);
    setVideoFile(null);
    setIsCreating(false);
    setEditingId(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${USER_API}/messages/new/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Erreur');
      const { id } = await res.json();

      if (imageFile) {
        const fd = new FormData();
        fd.append('image', imageFile);
        fd.append('messageId', id);
        await fetch(`${MEDIA_API}/uploadImage`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd
        });
      }

      if (videoFile) {
        const fd = new FormData();
        fd.append('video', videoFile);
        fd.append('messageId', id);
        await fetch(`${MEDIA_API}/uploadVideo`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd
        });
      }

      alert('✅ Message créé !');
      resetForm();
      dispatch(fetchMessages());
    } catch (error) {
      alert('❌ Erreur création');
    }
  };

  const handleEdit = (msg) => {
    setEditingId(msg.id);
    setFormData({ title: msg.title || '', content: msg.content || '', link: msg.link || '', attachment: msg.attachment || '' });
    setImageFile(null);
    setVideoFile(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${USER_API}/messages/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Erreur');

      // Si un nouveau fichier image est sélectionné, supprimer l'ancien puis uploader le nouveau
      if (imageFile) {
        // Supprimer l'ancienne image si elle existe
        const existingImage = messageMedia[editingId]?.find(m => m.type === 'image');
        if (existingImage) {
          await fetch(`${MEDIA_API}/media/${existingImage.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
        }
        
        // Uploader la nouvelle image
        const fd = new FormData();
        fd.append('image', imageFile);
        fd.append('messageId', editingId);
        await fetch(`${MEDIA_API}/uploadImage`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd
        });
      }

      // Si une nouvelle vidéo est sélectionnée, supprimer l'ancienne puis uploader la nouvelle
      if (videoFile) {
        // Supprimer l'ancienne vidéo si elle existe
        const existingVideo = messageMedia[editingId]?.find(m => m.type === 'video');
        if (existingVideo) {
          await fetch(`${MEDIA_API}/media/${existingVideo.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
        }
        
        // Uploader la nouvelle vidéo
        const fd = new FormData();
        fd.append('video', videoFile);
        fd.append('messageId', editingId);
        await fetch(`${MEDIA_API}/uploadVideo`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd
        });
      }

      alert('✅ Modifié !');
      resetForm();
      dispatch(fetchMessages());
    } catch (error) {
      alert('❌ Erreur modification');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('⚠️ Supprimer ?')) return;
    try {
      const res = await fetch(`${USER_API}/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` }
      });
      if (!res.ok) throw new Error('Erreur');
      alert('✅ Supprimé !');
      dispatch(fetchMessages());
    } catch (error) {
      alert('❌ Erreur suppression');
    }
  };

  return (
    <div className="admin-presse-manager">
      <h1 className="admin-title">🔧 GESTION PRESSE (ADMIN)</h1>
      
      {!isCreating && !editingId && (
        <button onClick={() => setIsCreating(true)} className="btn-create">➕ Créer un message</button>
      )}

      {isCreating && (
        <form onSubmit={handleCreate} className="crud-form">
          <h2>➕ Créer un message</h2>
          <input type="text" placeholder="Titre" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} required />
          <textarea placeholder="Contenu" value={formData.content} onChange={(e) => handleChange('content', e.target.value)} required rows="5" />
          <input type="text" placeholder="Lien" value={formData.link} onChange={(e) => handleChange('link', e.target.value)} />
          <input type="text" placeholder="Pièce jointe" value={formData.attachment} onChange={(e) => handleChange('attachment', e.target.value)} />
          <div className="media-upload">
            <label>📷 Images :</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          </div>
          <div className="media-upload">
            <label>🎥 Vidéos :</label>
            <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save">💾 Créer</button>
            <button type="button" onClick={resetForm} className="btn-cancel">❌ Annuler</button>
          </div>
        </form>
      )}

      <div className="messages-list">
        <h2>📋 Messages existants ({messages?.length || 0})</h2>
        {!messages || messages.length === 0 ? (
          <p className="no-messages">Aucun message</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="message-card">
              {editingId === msg.id ? (
                <form onSubmit={handleUpdate} className="crud-form">
                  <h3>✏️ Modifier #{msg.id}</h3>
                  <input type="text" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} required />
                  <textarea value={formData.content} onChange={(e) => handleChange('content', e.target.value)} required rows="5" />
                  <input type="text" value={formData.link} onChange={(e) => handleChange('link', e.target.value)} />
                  <input type="text" value={formData.attachment} onChange={(e) => handleChange('attachment', e.target.value)} />
                  
                  {messageMedia[msg.id] && messageMedia[msg.id].length > 0 && (
                    <div className="message-media">
                      <h4>📁 Médias actuels :</h4>
                      {messageMedia[msg.id].map((m) => (
                        <div key={m.id} className="media-item-display">
                          {m.type === 'image' ? (
                            <div className="media-preview">
                              <img src={m.path} alt={m.filename} className="media-thumbnail" />
                              <span className="media-filename">🖼️ {m.filename}</span>
                            </div>
                          ) : (
                            <div className="media-preview">
                              <video controls className="media-thumbnail">
                                <source src={m.path} type="video/mp4" />
                              </video>
                              <span className="media-filename">🎥 {m.filename}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="media-upload-section">
                    <h4>🔄 Remplacer les médias :</h4>
                    
                    {messageMedia[msg.id]?.some(m => m.type === 'image') && (
                      <div className="media-upload">
                        <label>📷 Remplacer l'image :</label>
                        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                        {imageFile && <p className="file-count">✅ {imageFile.name} sélectionnée</p>}
                      </div>
                    )}
                    
                    {messageMedia[msg.id]?.some(m => m.type === 'video') && (
                      <div className="media-upload">
                        <label>🎥 Remplacer la vidéo :</label>
                        <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
                        {videoFile && <p className="file-count">✅ {videoFile.name} sélectionnée</p>}
                      </div>
                    )}
                    
                    {(!messageMedia[msg.id] || messageMedia[msg.id].length === 0) && (
                      <p className="media-note">📝 Cet article est de type "Texte seul" - aucun média ne peut être ajouté.</p>
                    )}
                    
                    {messageMedia[msg.id] && messageMedia[msg.id].length > 0 && (
                      <p className="media-note">💡 Vous pouvez uniquement remplacer les médias existants. Le type d'article ne peut pas être modifié.</p>
                    )}
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="btn-save">💾 Sauvegarder</button>
                    <button type="button" onClick={resetForm} className="btn-cancel">❌ Annuler</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="message-header">
                    <h3>{msg.title}</h3>
                    <span className="message-id">ID: {msg.id}</span>
                  </div>
                  <p className="message-content">{msg.content}</p>
                  {msg.link && <p className="message-link">🔗 <a href={msg.link} target="_blank" rel="noopener noreferrer">{msg.link}</a></p>}
                  {msg.attachment && <p className="message-attachment">📎 {msg.attachment}</p>}
                  {messageMedia[msg.id] && messageMedia[msg.id].length > 0 && (
                    <div className="message-media">
                      <h4>📁 Médias :</h4>
                      <div className="media-gallery">
                        {messageMedia[msg.id].map((m) => (
                          <div key={m.id} className="media-item-card">
                            {m.type === 'image' ? (
                              <img src={m.path} alt={m.filename} className="media-display" />
                            ) : (
                              <video controls className="media-display">
                                <source src={m.path} type="video/mp4" />
                              </video>
                            )}
                            <div className="media-card-footer">
                              <span className="media-label">{m.type === 'image' ? '🖼️' : '🎥'} {m.filename}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="message-actions">
                    <button onClick={() => handleEdit(msg)} className="btn-edit">✏️ Modifier</button>
                    <button onClick={() => handleDelete(msg.id)} className="btn-delete">🗑️ Supprimer</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPresseManager;
