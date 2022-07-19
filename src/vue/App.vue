<template>

  <!-- Navigation-->
  <nav class="navbar navbar-expand-lg navbar-light fixed-top shadow-sm" id="mainNav">
      <div class="container px-5">
          <a class="navbar-brand fw-bold" href="#"><img height="40" src="../../public/assets/images/logo.png"></a>
      </div>
  </nav>
  
  <!-- Header-->
  <header class="masthead" style="padding-top: 2rem">
  </header>

  <!-- Headline -->
  <aside class="text-center bg-gradient-primary-to-secondary">
      <div class="container px-5">
          <div class="row gx-5 justify-content-center">
              <div class="col-sm-12">
                  <div class="h2 fs-3 text-white mb-0">
                      <p>With crypto, control your money.</p>
                      <p class="mb-0">With CryptoTestament, you decide who gets it after you're gone.</p>
                  </div>
              </div>
          </div>
      </div>
  </aside>

  <!-- Main content -->
  <div class="main" style="padding-top: 1.5rem; padding-bottom: 1rem">
    <router-view></router-view>
  </div>
  
  <!-- Footer-->
  <footer class="bg-black text-center py-5">
    <div class="container px-5">
        <div class="text-white-50 small">
            <div class="mb-0">CryptoTestament 2022</div>
        </div>
    </div>
  </footer>
  
</template>