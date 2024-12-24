export default defineContentScript({
  matches: ["https://*.console.aws.amazon.com/*"],
  main() {
    console.log("[AWS Navigator] Content Script Loaded");
    console.log("[AWS Navigator] Current URL:", window.location.href);

    // Listen for page changes within AWS Console
    const observer = new MutationObserver(() => {
      console.log("[AWS Navigator] AWS Console DOM Updated");
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup
    return () => {
      console.log("[AWS Navigator] Content Script Unloaded");
      observer.disconnect();
    };
  },
});
