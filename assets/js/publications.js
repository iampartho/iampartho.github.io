/* =====================================================================
   PUBLICATIONS: edit the two lists below to add or update entries.
   ---------------------------------------------------------------------
   The home page shows papers marked  selected: true ;
   the Publications page shows everything, grouped by type.

   Fields for PAPERS
     id         short unique name (also the link anchor: publications.html#pub-<id>)
     type       "conference" | "journal" | "chapter" | "preprint"
     title, authors (array), venue, year
     label      short badge text, e.g. "ISBI 2025";  color = badge colour
     selected   true -> also shown on the home page
     thumb      image path (put images in assets/img/pubs/), thumbAlt = description
     note       small highlighted word, e.g. "Poster" or "Oral" (optional)
     tldr       one-sentence summary (optional)
     abstract   full abstract (optional, shown by the ABSTRACT button)
     links      any of: doi, pdf, arxiv, code, poster, slides, project, video
     bibtex     citation shown by the BIBTEX button (optional)
   To add a paper: copy one { ... } block, paste it at the top, edit it.
   ===================================================================== */

var ME = ['Partho Ghosh'];

var PAPERS = [
  {
    id: 'isbi2025',
    type: 'conference',
    title: 'Multimodal Learning for Lung Segmentation: Enhancing UTE MRI Segmentation with CT Datasets',
    authors: ['Partho Ghosh', 'Keegan R. Staab', 'Jonathan L. Percy', 'Abhilash Kizhakke Puliyakote', 'Marrissa McIntosh', 'Andrew Hahn', 'Sean B. Fain', 'Sarah E. Gerard'],
    venue: '2025 IEEE 22nd International Symposium on Biomedical Imaging (ISBI), Houston, TX, USA',
    year: 2025,
    label: 'ISBI 2025', color: '#00629b',
    selected: true,
    thumb: 'assets/img/pubs/isbi2025.jpg',
    thumbAlt: 'Axial, coronal and sagittal views of a UTE MRI lung scan above the matching views of a CT lung scan',
    note: 'Poster',
    tldr: 'Training one network jointly on abundant labeled CT and scarce labeled UTE MRI, with a learnable downsampling layer for full-resolution 3D volumes and a false-positive penalty, reaches a Dice of 0.97 on UTE MRI lung segmentation.',
    abstract: 'Ultrashort echo time (UTE) magnetic resonance imaging (MRI) produces high-resolution structural images of the lungs without the ionizing radiation risks associated with computed tomography (CT) imaging. Lung segmentation in UTE is a necessary precursor to biomarker analysis, however, there are challenges associated with limited labeled training data, intensity inhomogeneity, noise, and image gradients. In this work, CT datasets are leveraged to improve the robustness of UTE lung segmentation, given limited labeled training data in the UTE domain. A novel joint training framework is proposed to simultaneously learn structural patterns important for multimodal lung segmentation. Additionally, a learnable downsample layer is proposed to enable training on full 3D CT and MRI images, while maintaining network complexity. Lastly, a false positive penalization loss is proposed to decrease erroneous segmentations associated with noise and gradients in UTE MRI. An ablation study evaluates each component’s contribution, with the proposed approach achieving a Dice coefficient of 0.97 and a surface distance of 1.05 mm.',
    links: { doi: 'https://doi.org/10.1109/ISBI60581.2025.10980692' },
    bibtex: [
      '@inproceedings{ghosh2025multimodal,',
      '  title     = {Multimodal Learning for Lung Segmentation: Enhancing {UTE} {MRI} Segmentation with {CT} Datasets},',
      '  author    = {Ghosh, Partho and Staab, Keegan R. and Percy, Jonathan L. and Puliyakote, Abhilash Kizhakke and McIntosh, Marrissa and Hahn, Andrew and Fain, Sean B. and Gerard, Sarah E.},',
      '  booktitle = {2025 IEEE 22nd International Symposium on Biomedical Imaging (ISBI)},',
      '  pages     = {1--5},',
      '  year      = {2025},',
      '  publisher = {IEEE},',
      '  doi       = {10.1109/ISBI60581.2025.10980692}',
      '}'
    ].join('\n')
  },
  {
    id: 'icasspw2023',
    type: 'conference',
    title: 'A Sequence Agnostic Multimodal Pre-Processing for Clogged Blood Vessel Detection in Alzheimer’s Diagnosis',
    authors: ['Partho Ghosh', 'Md. Abrar Istiak', 'Mir Sayeed Mohammad', 'Swapnil Saha', 'Uday Kamal'],
    venue: '2023 IEEE International Conference on Acoustics, Speech, and Signal Processing Workshops (ICASSPW), Rhodes Island, Greece',
    year: 2023,
    label: 'ICASSPW 2023', color: '#6b3fa0',
    selected: true,
    thumb: 'assets/img/pubs/icasspw2023.jpg',
    thumbAlt: 'Consecutive microscopy frames of a brain capillary with the vessel outlined, next to its 3D point-cloud representation',
    tldr: 'Extracting 3D point clouds from two-photon microscopy videos, fusing them with image features and learning order-invariant representations improves stalled-vessel detection for Alzheimer’s research.',
    abstract: 'Successful identification of blood vessel blockage is a crucial step for Alzheimer’s disease diagnosis. These blocks can be identified from the spatial and time-depth variable Two-Photon Excitation Microscopy (TPEF) images of the brain blood vessels using machine learning methods. In this study, we propose several pre-processing schemes to improve the performance of these methods. Our method includes 3D-point cloud data extraction from image modality and their feature-space fusion to leverage complementary information inherent in different modalities. We also enforce the learned representation to be sequence-order invariant by utilizing bidirection dataflow. Experimental results on The Clog Loss dataset show that our proposed method consistently outperforms the state-of-the-art pre-processing methods in stalled and non-stalled vessel classification.',
    links: {
      doi: 'https://doi.org/10.1109/ICASSPW59220.2023.10193405',
      arxiv: 'https://arxiv.org/abs/2211.03109'
    },
    bibtex: [
      '@inproceedings{ghosh2023sequence,',
      '  title     = {A Sequence Agnostic Multimodal Pre-Processing for Clogged Blood Vessel Detection in {A}lzheimer\'s Diagnosis},',
      '  author    = {Ghosh, Partho and Istiak, Md. Abrar and Mohammad, Mir Sayeed and Saha, Swapnil and Kamal, Uday},',
      '  booktitle = {2023 IEEE International Conference on Acoustics, Speech, and Signal Processing Workshops (ICASSPW)},',
      '  pages     = {1--5},',
      '  year      = {2023},',
      '  publisher = {IEEE},',
      '  doi       = {10.1109/ICASSPW59220.2023.10193405}',
      '}'
    ].join('\n')
  },
  {
    id: 'ic4ir2023',
    type: 'chapter',
    title: 'Activity Classification from First-Person Office Videos with Visual Privacy Protection',
    authors: ['Partho Ghosh', 'Md. Abrar Istiak', 'Nayeeb Rashid', 'Ahsan Habib Akash', 'Ridwan Abrar', 'Ankan Ghosh Dastider', 'Asif Shahriyar Sushmit', 'Taufiq Hasan'],
    venue: 'The Fourth Industrial Revolution and Beyond: Select Proceedings of IC4IR+, pp. 157–169, Springer Nature Singapore',
    year: 2023,
    label: 'IC4IR+ 2023', color: '#b5432b',
    thumb: 'assets/img/pubs/ic4ir2023.jpg',
    thumbAlt: 'A first-person office video frame with sensitive screens masked in red, and the same frame with those regions blurred',
    tldr: 'A privacy-aware system that finds and blurs sensitive objects (screens, faces, documents) in body-camera office videos, then classifies 18 activities. It grew out of our 3rd-place entry at the IEEE VIP Cup 2019.',
    abstract: 'In the advent of wearable body-cameras, human activity classification from First-Person Videos (FPV) has become a topic of increasing importance for various applications, including in life-logging, law-enforcement, sports, workplace, and healthcare. One of the challenging aspects of FPV is its exposure to potentially sensitive objects within the user’s field of view. In this work, we developed a privacy-aware activity classification system focusing on office videos. We utilized a Mask-RCNN with an Inception-ResNet hybrid as a feature extractor for detecting, and then blurring out sensitive objects (e.g., digital screens, human face, paper) from the videos. For activity classification, we incorporate an ensemble of Recurrent Neural Networks (RNNs) with ResNet, ResNext, and DenseNet based feature extractors. The proposed system was trained and evaluated on the FPV office video dataset that includes 18-classes made available through the IEEE Video and Image Processing (VIP) Cup 2019 competition. On the original unprotected FPVs, the proposed activity classifier ensemble reached an accuracy of 85.078% with precision, recall, and F1 scores of 0.88, 0.85 & 0.86, respectively. On privacy protected videos, the performances were slightly degraded, with accuracy, precision, recall, and F1 scores at 73.68%, 0.79, 0.75, and 0.74, respectively. The presented system won the 3rd prize in the IEEE VIP Cup 2019 competition. (Abstract of the arXiv preprint version.)',
    links: {
      doi: 'https://doi.org/10.1007/978-981-19-8032-9_12',
      arxiv: 'https://arxiv.org/abs/2006.06246'
    },
    bibtex: [
      '@inproceedings{ghosh2023activity,',
      '  title     = {Activity Classification from First-Person Office Videos with Visual Privacy Protection},',
      '  author    = {Ghosh, Partho and Istiak, Md. Abrar and Rashid, Nayeeb and Akash, Ahsan Habib and Abrar, Ridwan and Dastider, Ankan Ghosh and Sushmit, Asif Shahriyar and Hasan, Taufiq},',
      '  booktitle = {The Fourth Industrial Revolution and Beyond: Select Proceedings of IC4IR+},',
      '  pages     = {157--169},',
      '  year      = {2023},',
      '  publisher = {Springer Nature Singapore},',
      '  doi       = {10.1007/978-981-19-8032-9_12}',
      '}'
    ].join('\n')
  },
  {
    id: 'dghar2025',
    type: 'preprint',
    title: 'Domain Generalization for Improved Human Activity Recognition in Office Space Videos Using Adaptive Pre-processing',
    authors: ['Partho Ghosh', 'Raisa Bentay Hossain', 'Mohammad Zunaed', 'Taufiq Hasan'],
    venue: 'arXiv preprint arXiv:2503.12678',
    year: 2025,
    label: 'arXiv 2025', color: '#b31b1b',
    selected: true,
    thumb: 'assets/img/pubs/dghar2025.jpg',
    thumbAlt: 'Diagram of the proposed pre-processing framework with frame-stack generation, frame-wise attention and adaptive stream selection',
    tldr: 'Three plug-and-play pre-processing techniques that make any video encoder, including MViT, more robust to unseen office environments, outperforming domain-adaptation baselines.',
    abstract: 'Automatic video activity recognition is crucial across numerous domains like surveillance, healthcare, and robotics. However, recognizing human activities from video data becomes challenging when training and test data stem from diverse domains. Domain generalization, adapting to unforeseen domains, is thus essential. This paper focuses on office activity recognition amidst environmental variability. We propose three pre-processing techniques applicable to any video encoder, enhancing robustness against environmental variations. Our study showcases the efficacy of MViT, a leading state-of-the-art video classification model, and other video encoders combined with our techniques, outperforming state-of-the-art domain adaptation methods. Our approach significantly boosts accuracy, precision, recall and F1 score on unseen domains, emphasizing its adaptability in real-world scenarios with diverse video data sources. This method lays a foundation for more reliable video activity recognition systems across heterogeneous data domains.',
    links: {
      arxiv: 'https://arxiv.org/abs/2503.12678',
      pdf: 'https://arxiv.org/pdf/2503.12678'
    },
    bibtex: [
      '@misc{ghosh2025domain,',
      '  title         = {Domain Generalization for Improved Human Activity Recognition in Office Space Videos Using Adaptive Pre-processing},',
      '  author        = {Ghosh, Partho and Hossain, Raisa Bentay and Zunaed, Mohammad and Hasan, Taufiq},',
      '  year          = {2025},',
      '  eprint        = {2503.12678},',
      '  archivePrefix = {arXiv},',
      '  primaryClass  = {cs.CV},',
      '  doi           = {10.48550/arXiv.2503.12678}',
      '}'
    ].join('\n')
  },
  {
    id: 'resdta2023',
    type: 'preprint',
    title: 'ResDTA: Predicting Drug-Target Binding Affinity Using Residual Skip Connections',
    authors: ['Partho Ghosh', 'Md. Aynal Haque'],
    venue: 'arXiv preprint arXiv:2303.11434',
    year: 2023,
    label: 'arXiv 2023', color: '#b31b1b',
    thumb: 'assets/img/pubs/resdta2023.jpg',
    thumbAlt: 'ResDTA architecture: SMILES and protein-sequence streams with residual CNN blocks merged into a combined representation',
    tldr: 'CNNs with residual skip connections over raw SMILES strings and protein sequences predict drug–target binding affinity without hand-crafted chemistry features, outperforming AttentionDTA in concordance index.',
    abstract: 'The discovery of novel drug target (DT) interactions is an important step in the drug development process. The majority of computer techniques for predicting DT interactions have focused on binary classification, with the goal of determining whether or not a DT pair interacts. Protein ligand interactions, on the other hand, assume a continuous range of binding strength values, also known as binding affinity, and forecasting this value remains a difficulty. As the amount of affinity data in DT knowledge-bases grows, advanced learning techniques such as deep learning architectures can be used to predict binding affinities. In this paper, we present a deep-learning-based methodology for predicting DT binding affinities using just sequencing information from both targets and drugs. The results show that the proposed deep learning-based model that uses the 1D representations of targets and drugs is an effective approach for drug target binding affinity prediction and it does not require additional chemical domain knowledge to work with. The model in which high-level representations of a drug and a target are constructed via CNNs that uses residual skip connections and also with an additional stream to create a high-level combined representation of the drug-target pair achieved the best Concordance Index (CI) performance in one of the largest benchmark datasets, outperforming the recent state-of-the-art method AttentionDTA and many other machine-learning and deep-learning based baseline methods for DT binding affinity prediction that uses the 1D representations of targets and drugs.',
    links: {
      arxiv: 'https://arxiv.org/abs/2303.11434',
      pdf: 'https://arxiv.org/pdf/2303.11434'
    },
    bibtex: [
      '@misc{ghosh2023resdta,',
      '  title         = {{ResDTA}: Predicting Drug-Target Binding Affinity Using Residual Skip Connections},',
      '  author        = {Ghosh, Partho and Haque, Md. Aynal},',
      '  year          = {2023},',
      '  eprint        = {2303.11434},',
      '  archivePrefix = {arXiv},',
      '  primaryClass  = {cs.LG},',
      '  doi           = {10.48550/arXiv.2303.11434}',
      '}'
    ].join('\n')
  },
  {
    id: 'segcodenet2020',
    type: 'preprint',
    title: 'SegCodeNet: Color-Coded Segmentation Masks for Activity Detection from Wearable Cameras',
    authors: ['Asif Shahriyar Sushmit', 'Partho Ghosh', 'Md. Abrar Istiak', 'Nayeeb Rashid', 'Ahsan Habib Akash', 'Taufiq Hasan'],
    venue: 'arXiv preprint arXiv:2008.08452',
    year: 2020,
    label: 'arXiv 2020', color: '#b31b1b',
    thumb: 'assets/img/pubs/segcodenet2020.jpg',
    thumbAlt: 'Two-stream network: a raw RGB frame stream and a stream of color-coded segmentation masks feeding an activity recognizer',
    tldr: 'A two-stream network that adds color-coded semantic-segmentation masks of relevant objects to the RGB video stream, with stream-wise and frame-wise attention, outperforming I3D on 18-class first-person office activity detection.',
    abstract: 'Activity detection from first-person videos (FPV) captured using a wearable camera is an active research field with potential applications in many sectors, including healthcare, law enforcement, and rehabilitation. State-of-the-art methods use optical flow-based hybrid techniques that rely on features derived from the motion of objects from consecutive frames. In this work, we developed a two-stream network, the SegCodeNet, that uses a network branch containing video-streams with color-coded semantic segmentation masks of relevant objects in addition to the original RGB video-stream. We also include a stream-wise attention gating that prioritizes between the two streams and a frame-wise attention module that prioritizes the video frames that contain relevant features. Experiments are conducted on an FPV dataset containing 18 activity classes in office environments. In comparison to a single-stream network, the proposed two-stream method achieves an absolute improvement of 14.366% and 10.324% for averaged F1 score and accuracy, respectively, when average results are compared for three different frame sizes 224×224, 112×112, and 64×64. The proposed method provides significant performance gains for lower-resolution images with absolute improvements of 17% and 26% in F1 score for input dimensions of 112×112 and 64×64, respectively. The best performance is achieved for a frame size of 224×224 yielding an F1 score and accuracy of 90.176% and 90.799% which outperforms the state-of-the-art Inflated 3D ConvNet (I3D) method by an absolute margin of 4.529% and 2.419%, respectively.',
    links: {
      arxiv: 'https://arxiv.org/abs/2008.08452',
      code: 'https://github.com/iampartho/SegCodeNet'
    },
    bibtex: [
      '@misc{sushmit2020segcodenet,',
      '  title         = {{SegCodeNet}: Color-Coded Segmentation Masks for Activity Detection from Wearable Cameras},',
      '  author        = {Sushmit, Asif Shahriyar and Ghosh, Partho and Istiak, Md. Abrar and Rashid, Nayeeb and Akash, Ahsan Habib and Hasan, Taufiq},',
      '  year          = {2020},',
      '  eprint        = {2008.08452},',
      '  archivePrefix = {arXiv},',
      '  primaryClass  = {cs.CV},',
      '  doi           = {10.48550/arXiv.2008.08452}',
      '}'
    ].join('\n')
  }
];

/* Talks & posters: newest first. kind = "Poster" | "Oral" | "Talk" */
var PRESENTATIONS = [
  {
    year: 2026,
    title: 'Roughness-Enforced Causal Augmentation for Generalizable Lung Segmentation',
    authors: ['Partho Ghosh', 'Keegan R. Staab', 'Jonathan L. Percy', 'Abhilash Kizhakke Puliyakote', 'Marrissa McIntosh', 'Andrew Hahn', 'Sean B. Fain', 'Sarah E. Gerard'],
    venue: 'Research Open House (ROH), University of Iowa, Iowa City, IA',
    kind: 'Poster'
  },
  {
    year: 2025,
    title: 'Multimodal Learning for Lung Segmentation: Enhancing UTE MRI Segmentation with CT Datasets',
    authors: ['Partho Ghosh', 'Keegan R. Staab', 'Jonathan L. Percy', 'Abhilash Kizhakke Puliyakote', 'Marrissa McIntosh', 'Andrew Hahn', 'Sean B. Fain', 'Sarah E. Gerard'],
    venue: 'IEEE International Symposium on Biomedical Imaging (ISBI), Houston, TX',
    kind: 'Poster',
    link: 'https://doi.org/10.1109/ISBI60581.2025.10980692'
  },
  {
    year: 2025,
    title: 'Multimodal Learning for Lung Segmentation: Enhancing UTE MRI Segmentation with CT Datasets',
    authors: ['Partho Ghosh', 'Keegan R. Staab', 'Jonathan L. Percy', 'Abhilash Kizhakke Puliyakote', 'Marrissa McIntosh', 'Andrew Hahn', 'Sean B. Fain', 'Sarah E. Gerard'],
    venue: 'Research Open House (ROH), University of Iowa, Iowa City, IA',
    kind: 'Poster'
  },
  {
    year: 2024,
    title: 'Deep Learning for Automated Airway Segmentation in Chest CT Scans',
    authors: ['Partho Ghosh', 'Sarah E. Gerard'],
    venue: 'Research Open House (ROH), University of Iowa, Iowa City, IA',
    kind: 'Poster'
  }
];

/* ===================================================================== *
 *  Rendering: no need to edit below this line.                          *
 * ===================================================================== */
(function () {
  'use strict';

  var GROUPS = [
    { key: 'peer', title: 'Peer-reviewed papers', match: function (p) { return p.type !== 'preprint'; } },
    { key: 'preprint', title: 'Preprints', match: function (p) { return p.type === 'preprint'; } }
  ];
  var LINK_ORDER = ['doi', 'pdf', 'arxiv', 'code', 'poster', 'slides', 'project', 'video'];
  var LINK_LABEL = { doi: 'DOI', pdf: 'PDF', arxiv: 'arXiv', code: 'Code', poster: 'Poster', slides: 'Slides', project: 'Project', video: 'Video' };
  var ICON_EXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function authorsHTML(list) {
    return list.map(function (a) {
      return ME.indexOf(a) > -1 ? '<span class="me">' + esc(a) + '</span>' : esc(a);
    }).join(', ');
  }
  function paperHTML(p) {
    var id = 'pub-' + p.id, h = '';
    h += '<article class="pub" id="' + esc(id) + '">';
    h += '<div class="thumb">';
    h += '<span class="badge" style="--badge:' + esc(p.color || '#444') + '">' + esc(p.label) + '</span>';
    if (p.thumb) h += '<img src="' + esc(p.thumb) + '" alt="' + esc(p.thumbAlt || '') + '" loading="lazy" decoding="async">';
    h += '</div><div class="body">';
    h += '<h3>' + esc(p.title) + '</h3>';
    h += '<p class="authors">' + authorsHTML(p.authors) + '</p>';
    h += '<p class="venue">' + esc(p.venue) + (p.note ? '<span class="note">' + esc(p.note) + '</span>' : '') + '</p>';
    if (p.tldr) h += '<p class="tldr"><b>TL;DR</b>' + esc(p.tldr) + '</p>';
    h += '<div class="actions">';
    LINK_ORDER.forEach(function (k) {
      if (p.links && p.links[k]) {
        h += '<a class="chip-btn" href="' + esc(p.links[k]) + '" target="_blank" rel="noopener">' + LINK_LABEL[k] + ICON_EXT + '</a>';
      }
    });
    if (p.abstract) h += '<button class="chip-btn" type="button" aria-expanded="false" aria-controls="' + id + '-abs" data-drawer>Abstract</button>';
    if (p.bibtex) h += '<button class="chip-btn" type="button" aria-expanded="false" aria-controls="' + id + '-bib" data-drawer>BibTeX</button>';
    h += '</div>';
    if (p.abstract) h += '<div class="drawer" id="' + id + '-abs" hidden><p class="abs">' + esc(p.abstract) + '</p></div>';
    if (p.bibtex) {
      h += '<div class="drawer" id="' + id + '-bib" hidden><div class="bib-wrap"><pre>' + esc(p.bibtex) + '</pre>' +
        '<button class="chip-btn copy" type="button" data-copy="' + id + '-bib">Copy</button></div></div>';
    }
    h += '</div></article>';
    return h;
  }
  function presHTML(p) {
    return '<li><span class="yr">' + esc(p.year) + '</span><div>' +
      '<p class="t">' + (p.link ? '<a href="' + esc(p.link) + '" target="_blank" rel="noopener">' + esc(p.title) + '</a>' : esc(p.title)) + '</p>' +
      '<p class="a">' + authorsHTML(p.authors) + '</p>' +
      '<p class="v">' + esc(p.venue) + (p.kind ? ' <span class="badge" style="--badge:#16171b;color:#ffcd00;font-style:normal;margin-left:6px">' + esc(p.kind) + '</span>' : '') + '</p>' +
      '</div></li>';
  }
  function textOf(p) {
    return [p.title, p.authors.join(' '), p.venue, p.year, p.label || '', p.kind || '', p.tldr || ''].join(' ').toLowerCase();
  }
  function wire(root) {
    root.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-drawer]') : null;
      if (btn) {
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        if (panel) panel.hidden = open;
        return;
      }
      var cp = e.target.closest ? e.target.closest('[data-copy]') : null;
      if (cp) {
        var pre = document.querySelector('#' + cp.getAttribute('data-copy') + ' pre');
        if (!pre) return;
        var txt = pre.textContent, done = function () {
          cp.textContent = 'Copied'; setTimeout(function () { cp.textContent = 'Copy'; }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(txt).then(done, function () { selectText(pre); });
        } else { selectText(pre); }
      }
    });
  }
  function selectText(el) {
    var range = document.createRange(); range.selectNodeContents(el);
    var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
  }

  /* Home page: selected papers only */
  window.renderSelectedPubs = function (root) {
    if (!root) return;
    root.innerHTML = PAPERS.filter(function (p) { return p.selected; }).map(paperHTML).join('');
    wire(root);
  };

  /* Publications page: search + type filter + groups + presentations */
  window.renderAllPubs = function (root, opts) {
    if (!root) return;
    opts = opts || {};
    var search = opts.search, seg = opts.seg, stats = opts.stats;
    var filter = 'all', q = '';
    if (stats) {
      var peer = PAPERS.filter(GROUPS[0].match).length, pre = PAPERS.filter(GROUPS[1].match).length;
      stats.innerHTML = '<span><b>' + peer + '</b> peer-reviewed</span><span><b>' + pre + '</b> preprints</span>' +
        '<span><b>' + PRESENTATIONS.length + '</b> presentations</span>';
    }
    function draw() {
      var h = '', shown = 0;
      GROUPS.forEach(function (g) {
        if (filter !== 'all' && filter !== g.key) return;
        var list = PAPERS.filter(g.match).filter(function (p) { return !q || textOf(p).indexOf(q) > -1; })
          .sort(function (a, b) { return b.year - a.year; });
        if (!list.length) return;
        shown += list.length;
        h += '<h2 class="pub-group-title">' + g.title + ' <span class="count">' + list.length + '</span></h2>';
        h += list.map(paperHTML).join('');
      });
      if (filter === 'all' || filter === 'talks') {
        var pres = PRESENTATIONS.filter(function (p) { return !q || textOf(p).indexOf(q) > -1; });
        if (pres.length) {
          shown += pres.length;
          h += '<h2 class="pub-group-title">Presentations &amp; posters <span class="count">' + pres.length + '</span></h2>';
          h += '<ul class="pres">' + pres.map(presHTML).join('') + '</ul>';
        }
      }
      if (!shown) h = '<p class="pub-empty">Nothing matches “' + esc(q) + '”. Try another word.</p>';
      root.innerHTML = h;
    }
    if (search) search.addEventListener('input', function () { q = search.value.trim().toLowerCase(); draw(); });
    if (seg) {
      seg.addEventListener('click', function (e) {
        var b = e.target.closest ? e.target.closest('button[data-filter]') : null;
        if (!b) return;
        filter = b.getAttribute('data-filter');
        Array.prototype.forEach.call(seg.querySelectorAll('button'), function (x) {
          x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
        });
        draw();
      });
    }
    wire(root);
    draw();
    /* jump to #pub-... anchors once rendered */
    if (location.hash && location.hash.indexOf('#pub-') === 0) {
      var t = document.getElementById(location.hash.slice(1));
      if (t) setTimeout(function () { t.scrollIntoView(); }, 30);
    }
  };
})();
