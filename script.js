document.addEventListener('DOMContentLoaded', function() {
    let page = 1; 
    const limit = 10; 
    let fetching = false; 

    function fetchPosts() {
        fetching = true;
        document.getElementById('loading').style.display = 'block'; 
        fetch(`https://yande.re/post.json?tags=holds%3Afalse&limit=${limit}&page=${page}&api_version=2&rating=safe`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const postContainer = document.getElementById('post-container');
                if (data.posts.length === 0) {
                    page++;
                    fetchPosts(); 
                    return;
                }
                data.posts.forEach(post => {
                    const img = document.createElement('img');
                    img.src = post.sample_url; // Use lesser quality image URL
                    img.alt = post.tags;
                    const postDiv = document.createElement('div');
                    postDiv.classList.add('post');
                    postDiv.appendChild(img);
                    postContainer.appendChild(postDiv);
                });
                page++; 
                fetching = false;
                document.getElementById('loading').style.display = 'none'; 
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                fetching = false; 
                document.getElementById('loading').style.display = 'none'; 
            });
    }

    const main = document.querySelector('main');

    main.addEventListener('scroll', function() {
        if (!fetching && (main.scrollTop + main.clientHeight) >= main.scrollHeight) {
            document.getElementById('loading').style.display = 'block';
            console.log('Near bottom. Fetching more posts...');
            fetchPosts(); 
        }
    });

    // Initial fetch
    fetchPosts();
});
