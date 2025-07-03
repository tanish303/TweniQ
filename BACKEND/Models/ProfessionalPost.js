const mongoose = require('mongoose');

const professionalPostSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    title:   { type: String, required: true, trim: true },
    content: { type: String, required: true },

    /* ─── Poll ───────────────────────────────────────────── */
    Poll: {
      options: [{ type: String }],
      votes: [
        {
          option:   { type: String, required: true },
          count:    { type: Number, default: 0 },
          votedBy:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // ⬅️ NEW
        },
      ],
    },

    /* ─── Reactions ──────────────────────────────────────── */
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    /* ─── Comments ───────────────────────────────────────── */
    comments: [
      {
        commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        comment:     { type: String, required: true },
        createdAt:   { type: Date,   default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProfessionalPost', professionalPostSchema);
