class WishList {
    constructor() {
        this.wishList = document.querySelector('.wishes-container');
        this.wishForm = document.getElementById('wishForm');
        this.wishInput = document.getElementById('wishInput');
        this.addButton = document.querySelector('.add-wish-btn');

        // 清空旧数据
        localStorage.removeItem('wishes');
        localStorage.removeItem('achievementPoints');
        
        // 从 localStorage 加载数据
        this.wishes = JSON.parse(localStorage.getItem('wishes') || '[]');
        this.achievementPoints = parseInt(localStorage.getItem('achievementPoints') || '0');
        
        // 获取成就显示元素
        this.achievementBar = document.querySelector('.achievement-bar-fill');
        this.achievementDisplay = document.querySelector('.achievement-points');
        
        // 初始化显示
        this.updateAchievement();
        
        // 初始化
        this.bindEvents();
        this.renderWishes();
    }

    bindEvents() {
        // 添加愿望
        this.wishForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = this.wishInput.value.trim();
            if (text) {
                this.addWish(text);
                this.wishInput.value = '';
            }
        });
    }

    addWish(text) {
        const wish = {
            id: Date.now(),
            text,
            date: this.formatDate(new Date()),
            completed: false
        };

        this.wishes.push(wish);
        this.saveWishes();
        this.renderWishCard(wish);
    }

    renderWishes() {
        this.wishList.innerHTML = '';
        this.wishes.forEach(wish => this.renderWishCard(wish));
    }

    renderWishCard(wish) {
        const card = document.createElement('div');
        card.className = `wish-card ${wish.completed ? 'completed' : ''}`;
        card.innerHTML = `
            <div class="wish-content">
                <p class="wish-text">${wish.text}</p>
                <span class="wish-date">${wish.date}</span>
                <button class="complete-btn ${wish.completed ? 'completed' : ''}" title="完成愿望">
                    ✓
                </button>
            </div>
        `;

        // 完成按钮事件
        const completeBtn = card.querySelector('.complete-btn');
        completeBtn.addEventListener('click', () => {
            this.toggleWishComplete(wish, card);
        });

        this.wishList.appendChild(card);
    }

    saveWishes() {
        localStorage.setItem('wishes', JSON.stringify(this.wishes));
    }

    formatDate(date) {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${month}月${day}日 ${hours}:${minutes}`;
    }

    toggleWishComplete(wish, card) {
        wish.completed = !wish.completed;
        card.classList.toggle('completed');
        card.querySelector('.complete-btn').classList.toggle('completed');
        
        // 更新成就点数
        if (wish.completed) {
            this.addAchievementPoints(5);
        } else {
            this.addAchievementPoints(-5);
        }
        
        this.saveWishes();
    }

    addAchievementPoints(points) {
        const newPoints = Math.min(100, Math.max(0, this.achievementPoints + points));
        if (newPoints !== this.achievementPoints) {
            this.achievementPoints = newPoints;
            localStorage.setItem('achievementPoints', this.achievementPoints.toString());
            this.updateAchievement();
        }
    }

    updateAchievement() {
        // 确保是数字
        const points = parseInt(this.achievementPoints) || 0;
        
        // 更新进度条和文字
        this.achievementBar.style.width = `${points}%`;
        this.achievementDisplay.textContent = `${points}%`;
        
        // 当达到100%时显示兑换券
        if (points === 100) {
            this.showRewardModal();
        }
    }

    showRewardModal() {
        const modal = document.createElement('div');
        modal.className = 'reward-modal modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>🎉 恭喜！</h2>
                <p>你已达到100点成就！</p>
                <div class="reward-ticket">
                    <h3>✨ 奖励兑换券 ✨</h3>
                    <p>可以兑换任何你想要的奖励哦~</p>
                </div>
                <button class="claim-btn">领取奖励</button>
            </div>
        `;

        document.body.appendChild(modal);

        const claimBtn = modal.querySelector('.claim-btn');
        claimBtn.addEventListener('click', () => {
            // 清空所有愿望和进度
            this.wishes = [];
            this.achievementPoints = 0;
            localStorage.removeItem('wishes');
            localStorage.setItem('achievementPoints', '0');
            
            // 更新显示
            this.renderWishes();
            this.updateAchievement();
            
            modal.remove();
        });

        // 点击外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new WishList();
}); 