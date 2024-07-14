let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

fetchToys();

    function fetchToys() {
        fetch("http://localhost:3000/toys")
            .then(response => response.json())
            .then(toys => {
                toys.forEach(toy => {
                    renderToyCard(toy);
                });
            });
    }

    function renderToyCard(toy) {
        const card = document.createElement("div");
        card.className = "card";

        const h2 = document.createElement("h2");
        h2.textContent = toy.name;

        const img = document.createElement("img");
        img.src = toy.image;
        img.className = "toy-avatar";

        const p = document.createElement("p");
        p.textContent = `${toy.likes} Likes`;

        const likeButton = document.createElement("button");
        likeButton.className = "like-btn";
        likeButton.textContent = "Like ❤️";
        likeButton.dataset.id = toy.id;

        likeButton.addEventListener("click", handleLikeButtonClick);

        card.appendChild(h2);
        card.appendChild(img);
        card.appendChild(p);
        card.appendChild(likeButton);

        toyCollection.appendChild(card);
    }

    function handleToyFormSubmit(event) {
        event.preventDefault();
        const name = event.target.name.value;
        const image = event.target.image.value;

        fetch("http://localhost:3000/toys", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                name: name,
                image: image,
                likes: 0
            })
        })
        .then(response => response.json())
        .then(newToy => {
            renderToyCard(newToy);
            event.target.reset();
            toyFormContainer.style.display = "none"; // Hides the form after submission
            addToy = false; // Reset addToy flag
        });
    }

    function handleLikeButtonClick(event) {
        const toyId = event.target.dataset.id;
        const likesElement = event.target.previousSibling; // <p> element

        const currentLikes = parseInt(likesElement.textContent);
        const newLikes = currentLikes + 1;

        fetch(`http://localhost:3000/toys/${toyId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                likes: newLikes
            })
        })
        .then(response => response.json())
        .then(updatedToy => {
            likesElement.textContent = `${updatedToy.likes} Likes`;
        });
    }

    const toyForm = document.querySelector(".add-toy-form");
    toyForm.addEventListener("submit", handleToyFormSubmit);
});