namespace BOX.ViewModel
{
    public class EmailViewModel
    {
        public string TargetEmailAddress { get; set; }
        public string Subject { get; set; }
        public string TargetName { get; set; }
        public string Body { get; set; }
        public List<AttachmentViewModel> Attachments { get; set; } = new List<AttachmentViewModel>();
    }
}
