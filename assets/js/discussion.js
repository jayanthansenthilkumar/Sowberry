class DiscussionManager {
    constructor() {
        this.topics = [];
        this.currentCategory = 'General Discussion';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTopics();
    }

    bindEvents() {
        const newTopicBtn = document.querySelector('.new-topic-btn');
        const categoryItems = document.querySelectorAll('.forum-categories li');
        const sortSelect = document.querySelector('.discussion-sort select');

        newTopicBtn.addEventListener('click', () => this.showNewTopicModal());
        categoryItems.forEach(item => {
            item.addEventListener('click', (e) => this.changeCategory(e.target.textContent));
        });
        sortSelect.addEventListener('change', (e) => this.sortTopics(e.target.value));
    }

    loadTopics() {
        // Sample topics data
        this.topics = [
            {
                id: 1,
                title: 'How to handle async operations?',
                content: 'I\'m having trouble understanding promises...',
                author: 'John Doe',
                replies: 5,
                timestamp: new Date(Date.now() - 7200000),
                category: 'General Discussion'
            },
            {
                id: 2,
                title: 'Course material suggestion',
                content: 'Can we have more exercises on React hooks?',
                author: 'Jane Smith',
                replies: 3,
                timestamp: new Date(Date.now() - 3600000),
                category: 'Course Questions'
            }
        ];
        this.renderTopics();
    }

    renderTopics() {
        const discussionList = document.querySelector('.discussion-list');
        const filteredTopics = this.topics.filter(topic => 
            this.currentCategory === 'All' || topic.category === this.currentCategory
        );

        discussionList.innerHTML = filteredTopics.map(topic => `
            <div class="discussion-item" data-id="${topic.id}">
                <div class="discussion-avatar">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(topic.author)}" alt="${topic.author}">
                </div>
                <div class="discussion-content">
                    <h4>${topic.title}</h4>
                    <p>${topic.content}</p>
                    <div class="discussion-meta">
                        <span>Posted by ${topic.author}</span>
                        <span>${topic.replies} replies</span>
                        <span>${this.timeAgo(topic.timestamp)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval > 1) {
                return `${interval} ${unit}s ago`;
            } else if (interval === 1) {
                return `${interval} ${unit} ago`;
            }
        }
        return 'just now';
    }

    changeCategory(category) {
        this.currentCategory = category;
        this.renderTopics();
        
        // Update active category
        document.querySelectorAll('.forum-categories li').forEach(item => {
            item.classList.toggle('active', item.textContent === category);
        });
    }

    sortTopics(criteria) {
        switch(criteria) {
            case 'Latest':
                this.topics.sort((a, b) => b.timestamp - a.timestamp);
                break;
            case 'Most Active':
                this.topics.sort((a, b) => b.replies - a.replies);
                break;
            case 'Unanswered':
                this.topics = this.topics.filter(topic => topic.replies === 0);
                break;
        }
        this.renderTopics();
    }

    showNewTopicModal() {
        // Implementation for new topic modal
        alert('New topic functionality to be implemented');
    }
}

// Initialize discussion manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DiscussionManager();
});
