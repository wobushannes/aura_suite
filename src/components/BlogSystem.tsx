import React, { useState, useMemo } from 'react';
import { BlogPost, BlogPostComment, CRMData } from '../types';
import { 
  BookOpen, Plus, Search, Edit, Trash, MessageSquare, Check, ShieldAlert, FileText, ChevronRight, ArrowLeft, Clock, Calendar, CheckSquare, Sparkles, Tag, Globe, MessageCircle
} from 'lucide-react';

interface BlogSystemProps {
  role: 'admin' | 'customer';
  customerName?: string;
  customerEmail?: string;
  data: CRMData;
  onDataChange: (data: CRMData) => void;
  logAction: (action: string, details: string) => void;
  activeTemplate: any;
}

export default function BlogSystem({ role, customerName = '', customerEmail = '', data, onDataChange, logAction, activeTemplate }: BlogSystemProps) {
  const isAdmin = role === 'admin';
  const [activeView, setActiveView] = useState<'list' | 'single' | 'editor'>('list');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Search & Tag Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Compose Editor Form State
  const [postForm, setPostForm] = useState({
    title: '',
    slug: '',
    content: '',
    summary: '',
    image: '',
    category: 'Allgemein', // Will act as comma-separated Tags
    status: 'Published' as 'Draft' | 'Published'
  });

  // Comment Form State
  const [commentForm, setCommentForm] = useState({
    authorName: customerName || 'Kunde',
    authorEmail: customerEmail,
    content: '',
    dsgvoConsent: false
  });

  const posts = data.blogPosts || [];

  // Parse all WordPress-style Schlagworte (comma-separated tags from data.blogPosts)
  const allSchlagworte = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(p => {
      if (p.category) {
        p.category.split(',').forEach(tag => {
          const trimmed = tag.trim();
          if (trimmed) tagSet.add(trimmed);
        });
      }
    });
    return Array.from(tagSet);
  }, [posts]);

  // Count posts for each Schlagwort
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(p => {
      if (!p.category) return;
      p.category.split(',').forEach(tag => {
        const trimmed = tag.trim();
        if (trimmed) {
          counts[trimmed] = (counts[trimmed] || 0) + 1;
        }
      });
    });
    return counts;
  }, [posts]);

  // Core Filtering (Search phrase & Schlagwort filter)
  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      // Customers or visitors do not see drafts
      if (!isAdmin && p.status === 'Draft') return false;

      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesTag = true;
      if (selectedTag !== 'all') {
        if (!p.category) {
          matchesTag = false;
        } else {
          const tags = p.category.split(',').map(t => t.trim().toLowerCase());
          matchesTag = tags.includes(selectedTag.toLowerCase());
        }
      }

      return matchesSearch && matchesTag;
    }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [posts, searchTerm, selectedTag, isAdmin]);

  // Dynamic automatic slug generator
  const generateSlugFromTitle = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9 ]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  const handleTitleChange = (val: string) => {
    setPostForm(prev => ({
      ...prev,
      title: val,
      slug: generateSlugFromTitle(val)
    }));
  };

  // Compose Editor Form Actions
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title || !postForm.content) {
      alert('Bitte füllen Sie den Titel und den Beitrags-Inhalt aus.');
      return;
    }

    // fallback generated slug if empty
    const slugVal = postForm.slug.trim() || generateSlugFromTitle(postForm.title);
    let updatedPosts: BlogPost[];

    const existingPost = selectedPost ? posts.find(p => p.id === selectedPost.id) : null;

    if (existingPost) {
      // Edit Post
      updatedPosts = posts.map(p => {
        if (p.id === existingPost.id) {
          logAction('Blogbeitrag bearbeitet', `Beitrag: ${postForm.title}, Status: ${postForm.status}`);
          return {
            ...p,
            title: postForm.title,
            slug: slugVal,
            content: postForm.content,
            summary: postForm.summary,
            image: postForm.image || undefined,
            category: postForm.category || 'Allgemein',
            status: postForm.status
          };
        }
        return p;
      });
    } else {
      // New Post
      const newPost: BlogPost = {
        id: `post-${Date.now()}`,
        title: postForm.title,
        slug: slugVal,
        content: postForm.content,
        summary: postForm.summary,
        image: postForm.image || undefined,
        category: postForm.category || 'Allgemein',
        status: postForm.status,
        createdAt: new Date().toISOString(),
        authorName: 'Redaktion',
        comments: []
      };

      updatedPosts = [...posts, newPost];
      logAction('Blogbeitrag erstellt', `Neuer Beitrag: ${newPost.title}, Status: ${newPost.status}`);
    }

    onDataChange({
      ...data,
      blogPosts: updatedPosts
    });

    setActiveView('list');
    setSelectedPost(null);
  };

  const handlePostDelete = (id: string, title: string) => {
    if (confirm(`Sind Sie sicher, dass Sie den Beitrag '${title}' löschen möchten?`)) {
      const updated = posts.filter(p => p.id !== id);
      onDataChange({ ...data, blogPosts: updated });
      logAction('Blogbeitrag gelöscht', `Beitrag ID: ${id}, Titel: ${title}`);
    }
  };

  // Submit Comments
  const handleCommentSubmit = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!commentForm.authorName || !commentForm.content) {
      alert('Bitte geben Sie Name und Kommentar ein.');
      return;
    }
    if (!commentForm.dsgvoConsent) {
      alert('Bitte stimmen Sie den Datenschutzbestimmungen (DSGVO) zu.');
      return;
    }

    const newComment: BlogPostComment = {
      id: `comm-${Date.now()}`,
      authorName: commentForm.authorName,
      authorEmail: commentForm.authorEmail || '',
      content: commentForm.content,
      createdAt: new Date().toISOString(),
      isApproved: isAdmin, // Admins auto-approve; customers require moderation
      dsgvoConsent: true
    };

    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    });

    onDataChange({
      ...data,
      blogPosts: updatedPosts
    });

    logAction('Blog-Kommentar verfasst', `Ziel-Beitrags-ID: ${postId}, Autor: ${commentForm.authorName}`);
    
    alert(isAdmin ? 'Kommentar live aufgeschaltet!' : 'Vielen Dank! Ihr Beitrag wurde zur redaktionellen Moderation eingereicht.');

    setCommentForm({
      authorName: customerName || 'Kunde',
      authorEmail: customerEmail,
      content: '',
      dsgvoConsent: false
    });

    // Refresh selected view reference in state
    const refreshed = updatedPosts.find(p => p.id === postId);
    if (refreshed) setSelectedPost(refreshed);
  };

  const handleApproveComment = (postId: string, commentId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const updatedComments = p.comments.map(c => 
          c.id === commentId ? { ...c, isApproved: true } : c
        );
        return { ...p, comments: updatedComments };
      }
      return p;
    });

    onDataChange({ ...data, blogPosts: updated });
    logAction('Kommentar genehmigt', `Hierdurch wurde Kommentar ${commentId} live freigegeben.`);

    const refreshed = updated.find(p => p.id === postId);
    if (refreshed) setSelectedPost(refreshed);
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    if (confirm('Möchten Sie diesen Kommentar unwiderruflich entfernen?')) {
      const updated = posts.map(p => {
        if (p.id === postId) {
          const filteredComments = p.comments.filter(c => c.id !== commentId);
          return { ...p, comments: filteredComments };
        }
        return p;
      });

      onDataChange({ ...data, blogPosts: updated });
      logAction('Kommentar gelöscht', `Kommentar ID: ${commentId} wurde entfernt.`);

      const refreshed = updated.find(p => p.id === postId);
      if (refreshed) setSelectedPost(refreshed);
    }
  };

  // Estimate reading time based on German normal reading speed
  const getReadTimeStr = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 180);
    return `${minutes} Min. Lesezeit`;
  };

  return (
    <div className="space-y-6">
      {/* Blog module header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            Blog
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Persönliche Beiträge, Ankündigungen und Hintergrundartikel.
          </p>
        </div>

        {isAdmin && activeView === 'list' && (
          <button
            onClick={() => {
              setSelectedPost(null);
              setPostForm({ title: '', slug: '', content: '', summary: '', image: '', category: 'Allgemein', status: 'Published' });
              setActiveView('editor');
            }}
            className={`px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-all cursor-pointer`}
          >
            <Plus className="h-4 w-4" /> Neuen Beitrag erstellen
          </button>
        )}
      </div>

      {/* VIEW 1: MAIN BLOG FEED (WordPress-Style With Widget Sidebar) */}
      {activeView === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Column A: Posts List Feed */}
          <div className="lg:col-span-3 space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="bg-white p-12 text-center text-slate-400 border border-slate-200 rounded-2xl shadow-xs font-medium">
                <Sparkles className="h-8 w-8 text-slate-350 mx-auto mb-3" />
                Keine Beiträge gefunden. Passen Sie Ihre Filter an.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map(post => {
                  const commentsCount = post.comments.filter(c => c.isApproved).length;
                  const moderationRequired = post.comments.filter(c => !c.isApproved).length;
                  const wordCountTime = getReadTimeStr(post.content);
                  const postFirstTag = post.category ? post.category.split(',')[0].trim() : 'Allgemein';

                  return (
                    <article 
                      key={post.id} 
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image Header with Badge Overlay */}
                        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden border-b border-slate-100">
                          {post.image ? (
                            <img 
                              src={post.image} 
                              referrerPolicy="no-referrer" 
                              alt={post.title} 
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-350 bg-slate-50 text-xl font-sans tracking-wide">
                              {postFirstTag}
                            </div>
                          )}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                            {post.category ? (
                              post.category.split(',').slice(0, 2).map((t, i) => (
                                <span key={i} className="px-2 py-0.5 bg-slate-900/80 text-white text-[9px] font-bold font-sans tracking-wider rounded-md uppercase backdrop-blur-xs select-none">
                                  {t.trim()}
                                </span>
                              ))
                            ) : (
                              <span className="px-2 py-0.5 bg-slate-900/80 text-white text-[9px] font-bold font-sans tracking-wider rounded-md uppercase backdrop-blur-xs select-none">
                                Allgemein
                              </span>
                            )}
                          </div>
                          
                          {isAdmin && post.status === 'Draft' && (
                            <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-md uppercase">
                              Entwurf
                            </span>
                          )}
                        </div>

                        {/* Title and Short Intro Text */}
                        <div className="p-5 space-y-2.5">
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.createdAt).toLocaleDateString('de-DE')}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {wordCountTime}
                            </span>
                          </div>

                          <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors leading-snug tracking-tight">
                            {post.title}
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-3">
                            {post.summary}
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions Panel */}
                      <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => { setSelectedPost(post); setActiveView('single'); }}
                          className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          Weiterlesen <ChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        <div className="flex items-center gap-2.5 text-xs text-slate-400 font-semibold font-mono">
                          <span className="flex items-center gap-1" title={`${commentsCount} freigegebene Kommentare`}>
                            <MessageSquare className="h-3.5 w-3.5" />
                            {commentsCount}
                          </span>

                          {isAdmin && moderationRequired > 0 && (
                            <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-full animate-pulse" title="Muss moderiert werden">
                              {moderationRequired}!
                            </span>
                          )}

                          {isAdmin && (
                            <div className="flex items-center gap-1.5 ml-1.5 border-l border-slate-200 pl-2.5">
                              <button
                                onClick={() => {
                                  setSelectedPost(post);
                                  setPostForm({
                                    title: post.title,
                                    slug: post.slug,
                                    content: post.content,
                                    summary: post.summary || '',
                                    image: post.image || '',
                                    category: post.category,
                                    status: post.status
                                  });
                                  setActiveView('editor');
                                }}
                                className="p-1 text-slate-500 hover:text-indigo-600 transition-colors"
                                title="Beitrag bearbeiten"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handlePostDelete(post.id, post.title)}
                                className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                title="Beitrag löschen"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Column B: WP-Style Widget-Sidebar panel */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Widget 1: Suche */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5 text-slate-500" />
                Beiträge Suchen
              </h4>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Einträge filtern..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 pl-3 pr-8 outline-none text-xs focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Widget 2: Wordpress-Style Schlagworte (Tags) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-indigo-500" />
                Schlagworte
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedTag('all')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all border ${
                    selectedTag === 'all'
                      ? 'bg-indigo-600/10 text-indigo-600 border-indigo-400 font-bold'
                      : 'bg-slate-50 text-slate-500 border-transparent hover:bg-slate-100 hover:text-slate-700'
                  }`}
                >
                  Alle ({posts.length})
                </button>
                {allSchlagworte.map(tag => {
                  const isCur = selectedTag.toLowerCase() === tag.toLowerCase();
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(isCur ? 'all' : tag)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all border flex items-center gap-1 ${
                        isCur
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                          : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100 hover:text-slate-700'
                      }`}
                    >
                      <span>#{tag}</span>
                      <span className={`text-[9px] font-mono opacity-80 ${isCur ? 'text-white/90' : 'text-slate-400'}`}>
                        ({tagCounts[tag] || 0})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Widget 3: Info */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-800 shadow-xs space-y-2.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 translate-x-3 -translate-y-3 opacity-15">
                <BookOpen className="h-28 w-28 text-white" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 font-mono">Über diesen Blog</h4>
              <p className="text-xs leading-relaxed text-slate-300">
                Ein Rückzugsort für Fachwissen, gesetzliche Einblicke und direkte Ankündigungen unseres Berater-Teams. Stets aktuell, transparent, und sicher.
              </p>
            </div>
            
          </div>
        </div>
      )}

      {/* VIEW 2: SINGLE FULL BEITRAG SCREEN (With SEO Slug URL) */}
      {activeView === 'single' && selectedPost && (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => { setActiveView('list'); setSelectedPost(null); }}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" /> Zurück zum Blog
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  setPostForm({
                    title: selectedPost.title,
                    slug: selectedPost.slug,
                    content: selectedPost.content,
                    summary: selectedPost.summary || '',
                    image: selectedPost.image || '',
                    category: selectedPost.category,
                    status: selectedPost.status
                  });
                  setActiveView('editor');
                }}
                className="px-3 py-1.5 bg-slate-100 font-bold text-xs text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-200"
              >
                Beitrag bearbeiten
              </button>
            )}
          </div>

          {/* Post Article Block */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            {selectedPost.image && (
              <img 
                src={selectedPost.image} 
                referrerPolicy="no-referrer" 
                alt={selectedPost.title} 
                className="w-full aspect-[21/9] object-cover border-b border-slate-100" 
              />
            )}

            <div className="p-6 md:p-8 space-y-5">
              
              {/* Meta information tags */}
              <div className="flex flex-wrap gap-2 items-center text-xs text-slate-400 font-medium">
                {selectedPost.category ? (
                  selectedPost.category.split(',').map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold uppercase rounded-md text-[10px]">
                      {tag.trim()}
                    </span>
                  ))
                ) : (
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold uppercase rounded-md text-[10px]">
                    Allgemein
                  </span>
                )}
                <span>•</span>
                <span>{new Date(selectedPost.createdAt).toLocaleDateString('de-DE')}</span>
                <span>•</span>
                <span>von {selectedPost.authorName}</span>
                <span>•</span>
                <span>{getReadTimeStr(selectedPost.content)}</span>
              </div>

              {/* Title as clean heading display */}
              <h1 className="font-extrabold text-slate-900 text-2xl md:text-3xl tracking-tight leading-snug">
                {selectedPost.title}
              </h1>

              {/* SEO Friendly URL Structure Display Box */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-[11px] text-slate-500 font-mono select-all">
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-indigo-600" />
                  <strong>SEO-URL:</strong> /blog/{selectedPost.slug}
                </span>
                <span className="text-[10px] text-slate-400 bg-white border border-slate-100 rounded px-1.5">
                  Slug aktiv
                </span>
              </div>

              {/* Teaser block summary (styled beautiful as blockquote) */}
              {selectedPost.summary && (
                <div className="text-slate-600 italic text-sm leading-relaxed border-l-4 border-indigo-500 pl-4 bg-indigo-50/30 p-4 rounded-r-2xl font-medium">
                  {selectedPost.summary}
                </div>
              )}
              
              {/* Main content body rendered beautifully */}
              <div className="pt-2 text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-wrap font-serif">
                {selectedPost.content}
              </div>
            </div>
          </article>

          {/* COMMENTS CONTAINER SECTION */}
          <div className="space-y-4 pt-4">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <MessageSquare className="h-4 w-4 text-indigo-600" />
              Kommentare ({selectedPost.comments.filter(c => c.isApproved).length})
            </h3>

            {/* Render Approved Comments list */}
            <div className="space-y-3.5">
              {selectedPost.comments.filter(c => c.isApproved).length === 0 ? (
                <div className="p-6 bg-slate-50 rounded-2xl text-center text-slate-400 text-xs font-medium">
                  Bisher kein Kommentar verfasst. Hinterlassen Sie gern Ihre Nachricht!
                </div>
              ) : (
                selectedPost.comments.filter(c => c.isApproved).map(comm => (
                  <div key={comm.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">{comm.authorName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{new Date(comm.createdAt).toLocaleString('de-DE')}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-line">{comm.content}</p>
                    {isAdmin && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleDeleteComment(selectedPost.id, comm.id)}
                          className="text-[10px] text-rose-500 hover:underline flex items-center gap-0.5 font-semibold"
                        >
                          <Trash className="h-3 w-3" /> Kommentar Löschen
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* ADMIN COMMENT MODERATION CONTROL BOARD */}
            {isAdmin && selectedPost.comments.filter(c => !c.isApproved).length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                  <ShieldAlert className="h-4 w-4 text-rose-500 animate-pulse" />
                  Zur Moderation freizugebende Kommentare ({selectedPost.comments.filter(c => !c.isApproved).length})
                </div>

                <div className="divide-y divide-slate-800 space-y-4">
                  {selectedPost.comments.filter(c => !c.isApproved).map((comm, idx) => (
                    <div key={comm.id} className={`${idx > 0 ? 'pt-4' : ''} space-y-2 text-xs`}>
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                        <span><strong>{comm.authorName}</strong> ({comm.authorEmail})</span>
                        <span>{new Date(comm.createdAt).toLocaleString('de-DE')}</span>
                      </div>
                      <p className="text-slate-300 italic font-mono bg-black/40 p-3 border border-slate-800 rounded-xl leading-relaxed">
                        {comm.content}
                      </p>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleApproveComment(selectedPost.id, comm.id)}
                          className="px-3 py-1.5 bg-indigo-600 text-[10px] font-bold rounded-lg hover:bg-indigo-700 text-white flex items-center gap-0.5 cursor-pointer shadow-xs"
                        >
                          <Check className="h-3 w-3" /> Freigeben
                        </button>
                        <button
                          onClick={() => handleDeleteComment(selectedPost.id, comm.id)}
                          className="px-3 py-1.5 bg-transparent hover:bg-rose-950/20 text-rose-400 hover:text-rose-300 text-[10px] font-bold rounded-lg border border-rose-900/50 flex items-center gap-0.5 cursor-pointer"
                        >
                          <Trash className="h-3 w-3" /> Verwerfen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LEAVE COMMENTS FORM PANEL */}
            <form onSubmit={(e) => handleCommentSubmit(e, selectedPost.id)} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1"><MessageCircle className="h-4 w-4 text-slate-500" /> Kommentar verfassen</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ihr Name *</label>
                  <input
                    type="text"
                    required
                    value={commentForm.authorName}
                    onChange={(e) => setCommentForm({ ...commentForm, authorName: e.target.value })}
                    placeholder="z.B. Schmidt Handels GmbH"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">E-Mail Adresse (Optional)</label>
                  <input
                    type="email"
                    value={commentForm.authorEmail || ''}
                    onChange={(e) => setCommentForm({ ...commentForm, authorEmail: e.target.value })}
                    placeholder="kontakt@meinewebsite.de"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Inhalt *</label>
                <textarea
                  required
                  rows={4}
                  value={commentForm.content}
                  onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                  placeholder="Ihre Nachricht oder wertvolle Rückmeldung..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all leading-relaxed"
                />
              </div>

              {/* DSGVO Comment Tickbox Consent */}
              <div className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-xl text-[10px] space-y-1.5 text-slate-500 leading-normal font-sans">
                <label className="flex gap-2 items-start cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={commentForm.dsgvoConsent}
                    onChange={(e) => setCommentForm({ ...commentForm, dsgvoConsent: e.target.checked })}
                    className="mt-0.5 rounded cursor-pointer accent-indigo-600"
                  />
                  <span>
                    * Ich willige ein (nach DSGVO Abs. 7), dass mein Kommentar und mein Name sicher auf dem Portal verarbeitet und nach redaktioneller Freigabe im Blog gelistet werden. Meine E-Mail bleibt geheim.
                  </span>
                </label>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Absenden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 3: COMPOSER & WRITING SUITE (With Real-Time SEO-Friendly Slug Helper) */}
      {activeView === 'editor' && (
        <form onSubmit={handlePostSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 max-w-2xl mx-auto text-slate-800 animate-fade-in">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center bg-slate-50/50 p-3 rounded-2xl">
            <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-indigo-600" />
              {selectedPost ? 'Beitrag überarbeiten' : 'Neuen Beitrag verfassen'}
            </span>
            <button
              type="button"
              onClick={() => { setActiveView('list'); setSelectedPost(null); }}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
            >
              Abbrechen
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Beitragstitel *</label>
              <input
                type="text"
                required
                value={postForm.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="z.B. Wichtige Änderungen im Steuerrecht"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Schlagworte (mit Komma trennen)</label>
              <input
                type="text"
                value={postForm.category}
                onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                placeholder="z.B. Steuern, Finanzen, Updates, Recht"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Dynamic SEO Slug Form Area */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">SEO-freundlicher Slug (URL-Struktur)</label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-slate-100 text-slate-500 border border-r-0 border-slate-200 rounded-l-xl text-xs font-mono select-none">
                /blog/
              </span>
              <input
                type="text"
                value={postForm.slug}
                onChange={(e) => setPostForm({ ...postForm, slug: generateSlugFromTitle(e.target.value) })}
                placeholder="z-b-wichtige-aenderungen-im-steuerrecht"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-r-xl p-2 py-2 text-xs outline-none font-mono focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
              />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Ein rein SEO-freundlicher Pfadbezeichner, der den Artikel im Web ideal auffindbar macht.
            </span>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Teaser / Kurzzusammenfassung *</label>
            <textarea
              required
              rows={2}
              value={postForm.summary}
              onChange={(e) => setPostForm({ ...postForm, summary: e.target.value })}
              placeholder="Zusammenfassung am Anfang des Artikels..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Inhalt *</label>
            <textarea
              required
              rows={10}
              value={postForm.content}
              onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
              placeholder="Schreiben Sie hier den vollständigen Eintrag oder Blog-Post..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 leading-relaxed font-serif"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Optionales Titelbild (URL)</label>
              <input
                type="text"
                value={postForm.image}
                onChange={(e) => setPostForm({ ...postForm, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
              <select
                value={postForm.status}
                onChange={(e: any) => setPostForm({ ...postForm, status: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 cursor-pointer"
              >
                <option value="Published">Veröffentlicht (Für alle sichtbar)</option>
                <option value="Draft">Entwurf (Nur Admin sieht diesen Beitrag)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => { setActiveView('list'); setSelectedPost(null); }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer transition-all"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {selectedPost ? 'Speichern' : 'Hinzufügen'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
