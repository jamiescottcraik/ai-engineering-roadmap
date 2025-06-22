# Contributing to AI Engineering Roadmap

Thank you for your interest in contributing to the AI Engineering Roadmap! This document provides guidelines and instructions for various types of contributions.

## 🎯 Types of Contributions

### 1. **Resource Additions**

- Course links, tutorials, books, and learning materials
- Practice platforms and project ideas
- Community resources and newsletters
- Open source repositories and tools

### 2. **Content Improvements**

- Notes and explanations for courses/concepts
- Screenshots and visual aids
- Code examples and implementations
- Progress tracking and reviews

### 3. **Structure Enhancements**

- Roadmap organization and flow
- New learning paths or specializations
- Metadata and categorization improvements
- Time estimates and difficulty ratings

### 4. **Bug Reports & Fixes**

- Broken links or outdated resources
- JSON structure errors
- UI/UX issues
- Documentation gaps

## 📁 Repository Structure

```bash
ai-engineering-roadmap/
├── roadmaps/           # Core curriculum data (JSON/YAML)
├── notes/              # Study notes, explanations, reviews
├── code/               # Project code, scripts, notebooks
├── assets/             # Images, diagrams, screenshots
├── docs/               # Documentation and guides
├── frontend/           # Interactive roadmap UI
└── scripts/            # Validation and automation tools
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (for frontend development)
- Python 3.11+ (for scripts and validation)
- Git (for version control)

### Setup

```bash
# Clone the repository
git clone https://github.com/jamiescottcraik/ai-engineering-roadmap.git
cd ai-engineering-roadmap

# Install frontend dependencies
cd frontend
npm install

# Build and test locally
npm run dev
```

## 📝 Contributing Resources

### Adding Courses/Resources

1. **Update roadmap JSON**: Add to `/roadmaps/roadmap.json`
2. **Required fields**:

   ```json
   {
     "id": "unique-resource-id",
     "title": "Resource Title",
     "description": "Brief description",
     "url": "https://example.com",
     "type": "course|book|tutorial|practice|project",
     "category": "critical|optional",
     "estimatedHours": 10,
     "difficulty": "beginner|intermediate|advanced",
     "prerequisites": ["prereq-id-1"],
     "skills": ["python", "machine-learning"],
     "provider": "Coursera|edX|etc"
   }
   ```

3. **Validate JSON**: Run `python3 -m json.tool roadmaps/roadmap.json`
4. **Test locally**: Build frontend and verify display

### Adding Notes & Documentation

1. **Create notes**: Add to `/notes/[phase]/[topic]/`
2. **Use clear structure**:

   ```markdown
   # Course/Topic Name
   
   ## Overview
   Brief description and learning objectives
   
   ## Key Concepts
   - Concept 1: explanation
   - Concept 2: explanation
   
   ## Code Examples
   \`\`\`python
   # Example code with comments
   \`\`\`
   
   ## Screenshots
   ![Description](../../assets/screenshots/filename.png)
   
   ## Review & Rating
   - Difficulty: ⭐⭐⭐
   - Quality: ⭐⭐⭐⭐⭐
   - Time Taken: X hours
   - Would Recommend: Yes/No
   ```

### Adding Code & Projects

1. **Create project folder**: `/code/[phase]/[project-name]/`
2. **Include README**: Document setup, usage, and learning outcomes
3. **Add requirements**: `requirements.txt` or `package.json`
4. **Comment thoroughly**: Explain learning concepts in code

## 🔍 Quality Guidelines

### Resource Quality Criteria

- **Relevance**: Directly supports roadmap learning objectives
- **Currency**: Updated within last 2 years (unless foundational)
- **Accessibility**: Free or reasonably priced options available
- **Quality**: High ratings/reviews or proven track record

### Code Quality Standards

- **Clean Code**: Follow language-specific style guides
- **Documentation**: Comprehensive comments and README files
- **Testing**: Include tests where applicable
- **Modularity**: Reusable, well-structured code

### Content Standards

- **Accuracy**: Technically correct and up-to-date
- **Clarity**: Easy to understand for target audience
- **Completeness**: Sufficient detail for practical use
- **Attribution**: Proper credit for sources and references

## 🔄 Submission Process

### 1. Fork & Branch

```bash
git checkout -b feature/add-tensorflow-course
# or
git checkout -b fix/broken-link-phase1
# or
git checkout -b docs/improve-setup-guide
```

### 2. Make Changes

- Follow the structure and quality guidelines above
- Test your changes locally
- Validate JSON structure
- Check for broken links

### 3. Commit

Use conventional commit format:

```bash
git commit -m "feat(resources): add TensorFlow certification course

- Added official TensorFlow Developer Certificate course
- Categorized as critical for Phase 2 ML foundations
- Includes prerequisites and skill mappings
- Estimated 40 hours completion time"
```

### 4. Pull Request

- Fill out the PR template completely
- Reference any related issues
- Include screenshots for UI changes
- Request review from maintainers

## 🧪 Testing & Validation

### Before Submitting

- [ ] JSON validates without errors
- [ ] All links are working and accessible
- [ ] Frontend builds successfully
- [ ] New content follows style guidelines
- [ ] Documentation is updated if needed

### Automated Checks

- JSON schema validation
- Link checking
- Build verification
- Code linting (where applicable)

## 🏷️ Issue Templates

Use appropriate issue templates for:

- **Feature Request**: New resources or functionality
- **Bug Report**: Broken links, errors, or issues
- **Enhancement**: Improvements to existing content
- **Question**: Clarification or discussion

## 📋 Review Process

### Maintainer Review

- Content quality and relevance
- Technical accuracy
- Adherence to guidelines
- Impact on overall roadmap flow

### Community Feedback

- Learning value and effectiveness
- Accessibility and usability
- Alternative suggestions
- Real-world application

## 🏆 Recognition

Contributors are recognized through:

- **README Contributors Section**: All contributors listed
- **Release Notes**: Major contributions highlighted
- **LinkedIn Recommendations**: Available upon request
- **Community Shoutouts**: Social media recognition

## 📞 Getting Help

### Channels

- **GitHub Issues**: Technical problems or questions
- **GitHub Discussions**: Ideas, feedback, and community chat
- **Pull Request Comments**: Specific implementation questions

### Response Times

- **Issues**: Within 48 hours
- **Pull Requests**: Within 72 hours
- **Community Questions**: Within 24 hours

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

### Quick Guidelines

- **Be Respectful**: Treat all contributors with respect
- **Be Constructive**: Provide helpful, actionable feedback
- **Be Inclusive**: Welcome contributors of all backgrounds
- **Be Patient**: Remember that everyone is learning

---

## 📈 Roadmap Contribution Priorities

### High Priority

1. **Resource Quality**: Verify and update existing resources
2. **Content Gaps**: Fill missing explanations and examples
3. **Practical Projects**: Add hands-on coding exercises
4. **Community Resources**: Expand networking opportunities

### Medium Priority

1. **Visual Aids**: Screenshots, diagrams, and infographics
2. **Alternative Paths**: Different routes for various backgrounds
3. **Assessment Tools**: Quizzes and knowledge checks
4. **Time Estimates**: Improve accuracy of duration predictions

### Low Priority

1. **Advanced Topics**: Cutting-edge research areas
2. **Specialized Tools**: Niche or experimental resources
3. **Historical Context**: Background and evolution of concepts
4. **Industry Insights**: Market trends and career advice

---

Thank you for contributing to the AI Engineering community! 🚀

#### Last updated: June 22, 2025
