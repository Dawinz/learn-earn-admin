import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import './Lessons.css';

interface Lesson {
  _id: string;
  title: string;
  summary: string;
  contentMD: string;
  category: string;
  estMinutes: number;
  isPublished: boolean;
  tags: string[];
  quiz: {
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
  };
  adSlots: number[];
  createdAt: string;
  updatedAt: string;
}

interface EditLessonData {
  title: string;
  summary: string;
  contentMD: string;
  category: string;
  estMinutes: number;
  isPublished: boolean;
  tags: string[];
}

export const Lessons: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPublished, setShowPublished] = useState<boolean | undefined>(undefined);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editData, setEditData] = useState<EditLessonData>({
    title: '',
    summary: '',
    contentMD: '',
    category: '',
    estMinutes: 0,
    isPublished: false,
    tags: []
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLessons();
  }, [showPublished]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const url = showPublished !== undefined 
        ? `${API_ENDPOINTS.LESSONS}?published=${showPublished}`
        : API_ENDPOINTS.LESSONS;
      const response = await axios.get(url);
      setLessons(response.data.lessons);
    } catch (err) {
      setError('Failed to load lessons');
      console.error('Lessons error:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (lessonId: string, currentStatus: boolean) => {
    try {
      await axios.put(`${API_ENDPOINTS.LESSONS}/${lessonId}`, {
        isPublished: !currentStatus
      });
      fetchLessons(); // Refresh the list
    } catch (err) {
      console.error('Toggle publish error:', err);
    }
  };

  const openEditModal = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setEditData({
      title: lesson.title,
      summary: lesson.summary,
      contentMD: lesson.contentMD,
      category: lesson.category,
      estMinutes: lesson.estMinutes,
      isPublished: lesson.isPublished,
      tags: lesson.tags
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingLesson(null);
    setEditData({
      title: '',
      summary: '',
      contentMD: '',
      category: '',
      estMinutes: 0,
      isPublished: false,
      tags: []
    });
  };

  const saveLesson = async () => {
    if (!editingLesson) return;
    
    try {
      setSaving(true);
      await axios.put(`${API_ENDPOINTS.LESSONS}/${editingLesson._id}`, editData);
      fetchLessons(); // Refresh the list
      closeEditModal();
    } catch (err) {
      console.error('Save lesson error:', err);
      setError('Failed to save lesson');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof EditLessonData, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setEditData(prev => ({
      ...prev,
      tags
    }));
  };

  if (loading) {
    return <div className="lessons">Loading lessons...</div>;
  }

  if (error) {
    return <div className="lessons error">Error: {error}</div>;
  }

  return (
    <div className="lessons">
      <h1>Lesson Management</h1>
      
      <div className="filters">
        <button 
          className={showPublished === undefined ? 'active' : ''}
          onClick={() => setShowPublished(undefined)}
        >
          All
        </button>
        <button 
          className={showPublished === true ? 'active' : ''}
          onClick={() => setShowPublished(true)}
        >
          Published
        </button>
        <button 
          className={showPublished === false ? 'active' : ''}
          onClick={() => setShowPublished(false)}
        >
          Draft
        </button>
      </div>

      <div className="lessons-grid">
        {lessons.map((lesson) => (
          <div key={lesson._id} className="lesson-card">
            <div className="lesson-header">
              <h3>{lesson.title}</h3>
              <span className={`status ${lesson.isPublished ? 'published' : 'draft'}`}>
                {lesson.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            <p className="lesson-summary">{lesson.summary}</p>
            <div className="lesson-meta">
              <span className="category">{lesson.category}</span>
              <span className="duration">{lesson.estMinutes}m</span>
            </div>
            <div className="lesson-actions">
              <button 
                className={`btn-toggle ${lesson.isPublished ? 'unpublish' : 'publish'}`}
                onClick={() => togglePublish(lesson._id, lesson.isPublished)}
              >
                {lesson.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <button 
                className="btn-edit"
                onClick={() => openEditModal(lesson)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Lesson</h2>
              <button className="modal-close" onClick={closeEditModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Lesson title"
                />
              </div>

              <div className="form-group">
                <label>Summary</label>
                <textarea
                  value={editData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="Brief description of the lesson"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Content (Markdown)</label>
                <textarea
                  value={editData.contentMD}
                  onChange={(e) => handleInputChange('contentMD', e.target.value)}
                  placeholder="Lesson content in Markdown format"
                  rows={10}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={editData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option value="">Select Category</option>
                    <option value="AI Freelancing">AI Freelancing</option>
                    <option value="Digital Products">Digital Products</option>
                    <option value="Social Media Marketing">Social Media Marketing</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Content Creation">Content Creation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    value={editData.estMinutes}
                    onChange={(e) => handleInputChange('estMinutes', parseInt(e.target.value))}
                    placeholder="10"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editData.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editData.isPublished}
                    onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                  />
                  <span>Published</span>
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeEditModal}>
                Cancel
              </button>
              <button 
                className="btn-save" 
                onClick={saveLesson}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
